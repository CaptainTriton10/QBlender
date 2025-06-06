import Menu from '@/components/Menu.tsx';
import QueueView, { QueueViewRefType } from '@/components/QueueView/QueueView';
import { ThemeProvider } from '@/components/ThemeProvider.tsx';
import { useEffect, useReducer, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'sonner';
import { AppSidebar } from './components/AppSidebar';
import { columns } from './components/QueueView/columns';
import { SidebarProvider } from './components/ui/sidebar';
import { getFrames } from './handlers/blender-data-handler';
import Render from './handlers/render-handler';
import { setStore } from './handlers/store-handler';
import { renderQueueReducer } from './hooks/useRenderQueue';
import { getUpdatedPath, os } from './lib/utils';
import { RenderItem } from './types';

async function handleSelectBlenderLocation() {
  // @ts-expect-error
  const path = await window.open_file.openFile(true, ['']).then((path) => {
    setStore('blender_location', path[0]);
  });
}

function App() {
  const [data, setData] = useState<RenderItem[]>([]);
  const [filePath, setFilePath] = useState('...');

  const [renderQueue, dispatch] = useReducer(renderQueueReducer, []);

  const queueViewRef = useRef<QueueViewRefType>(null);
  const hasRun = useRef(false);

  const getSelectedRows = queueViewRef.current?.GetSelectedRows;

  useEffect(() => {
    const updatedQueue = renderQueue.map((render) => render.toRenderItem());

    setData(updatedQueue);
  }, [renderQueue]);

  async function handleUpload() {
    const currentQueueLength = renderQueue.length;

    // @ts-ignore
    const paths = await window.open_file.openFile(true, ['blend']).then((paths) => {
      paths.forEach((path: string) => {
        // Loop over each uploaded file
        const pathArray = getUpdatedPath(path);
        const fileName = pathArray[pathArray.length - 1];

        const temporaryPath = os == 'windows' ? ['C:', 'tmp'] : ['tmp'];

        dispatch({
          type: 'add_render',
          render: new Render(fileName, temporaryPath),
        });
      });

      let errorShown = false;
      for (let i = 0; i < paths.length; i++) {
        // Loop over each uploaded file
        getFrames(hasRun, paths[i]).then(
          function (data: number) {
            // If successful
            dispatch({
              type: 'update_render',
              index: i + currentQueueLength,
              updates: { frameCount: data },
            });
          },

          function (error: string) {
            // If error occurs
            console.log(error);

            if (!errorShown)
              toast.error('An error occured with blender, check your selected blender location.');
            errorShown = true;

            dispatch({
              type: 'update_render',
              index: i + currentQueueLength,
              updates: { frameCount: -2 },
            });
          },
        );
      }
    });
  }

  async function handleSelectExport() {
    // @ts-expect-error sybau typescript
    const selectedRenders: number[] = getSelectedRows();

    if (!selectedRenders.length) {
      toast.warning('No renders selected.');
      return;
    }

    // @ts-expect-error
    const path = await window.open_file.openFile(false).then((path) => {
      const exportLocation: string[] = path[0];
      setFilePath(path[0]);

      for (let i = 0; i < selectedRenders.length; i++) {
        dispatch({
          type: 'update_render',
          index: i,
          updates: { exportLocation: exportLocation },
        });
      }
    });
  }

  async function renderAll() {
    let startedRenders: boolean[] = new Array(renderQueue.length).fill(false);

    function callback(data: string) {
      console.log(data);
    }

    function closedCallback(index: number) {
      toast.info('Render completed.');
      dispatch({
        type: 'update_render',
        index: index,
        updates: {
          status: 'Completed',
        },
      });

      if (index + 1 < renderQueue.length && !startedRenders[index + 1]) {
        console.log(index, index + 1);
        propagateRender(index + 1);
      }
    }

    function errorCallback(index: number) {
      toast.error(`Error with render: ${renderQueue[index].filename}`);
      dispatch({
        type: 'update_render',
        index: index,
        updates: {
          status: 'Error',
        },
      });
    }

    function propagateRender(index: number) {
      // Ensure render hasn't already been started
      if (startedRenders[index]) return;
      startedRenders[index] = true;

      // Set the render to be "In Progress" before the render start
      dispatch({
        type: 'update_render',
        index: index,
        updates: {
          status: 'In Progress',
        },
      });

      // Render with callbacks
      renderQueue[index].render(
        hasRun,
        callback,
        () => closedCallback(index),
        () => errorCallback(index),
      );
    }

    // Start the first render (index 0)
    propagateRender(0);
  }

  useHotkeys('ctrl+i', handleUpload);

  return (
    <ThemeProvider defaultTheme="dark">
      <SidebarProvider defaultOpen={false}>
        <div
          style={{
            display: 'flex',
            height: '100vh',
            width: '100vw',
          }}
        >
          <AppSidebar />
          <main style={{ flex: 1 }}>
            {/* <SidebarTrigger /> */}
            <div className="p-5 flex flex-col gap-5 h-full">
              <Menu
                filePath={filePath}
                setFilePath={setFilePath}
                handleImport={handleUpload}
                handleSelectBlenderLocation={() => handleSelectBlenderLocation()}
                handleSelectExport={() => handleSelectExport()}
                renderAll={renderAll}
                selectAll={() => queueViewRef.current?.SelectAll()}
                deselectAll={() => queueViewRef.current?.DeselectAll()}
              />
              <QueueView
                ref={queueViewRef}
                columns={columns}
                data={data}
                className="rounded-md border flex-grow"
              />
              {/* <RenderStatus className="mt-auto rounded-md border h-40 bg-background" /> */}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
