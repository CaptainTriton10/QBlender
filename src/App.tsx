import Menu from '@/components/Menu.tsx';
import QueueView, { QueueViewRefType } from '@/components/QueueView/QueueView';
import { ThemeProvider } from '@/components/ThemeProvider.tsx';
import { useEffect, useReducer, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'sonner';
import { AppSidebar } from './components/AppSidebar';
import { columns } from './components/QueueView/columns';
import RenderStatus from './components/RenderStatus';
import { SidebarProvider } from './components/ui/sidebar';
import { getFrames, processRender } from './handlers/blender-data-handler';
import Render from './handlers/render-handler';
import { setStore } from './handlers/store-handler';
import { renderQueueReducer } from './hooks/useRenderQueue';
import { os } from './lib/utils';
import { RenderItem } from './types';

async function handleSelectBlenderLocation() {
  // @ts-expect-error
  const path = await window.open_file.openFile(true, ['']).then((path) => {
    setStore('blender_location', path[0]);
  });
}

function App() {
  // RenderQueue state
  const [renderQueue, dispatch] = useReducer(renderQueueReducer, []);

  // Refs
  const hasRun = useRef(false);

  // Menu
  const [filepath, setFilepath] = useState('...');

  // QueueView
  const [data, setData] = useState<RenderItem[]>([]);
  const queueViewRef = useRef<QueueViewRefType>(null);
  const getSelectedRows = queueViewRef.current?.getSelectedRows;

  // RenderStatus
  const [currentTime, setCurrentTime] = useState(0);
  const [frame, setFrame] = useState<[number, number]>([0, 0]);
  const [samples, setSamples] = useState<[number, number]>([0, 0]);
  const [renderNum, setRenderNum] = useState<[number, number]>([0, 0]);

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
        const temporaryPath = os == 'windows' ? 'C:\\tmp' : '/tmp';

        dispatch({
          type: 'add_render',
          render: new Render(path, temporaryPath, 1),
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
      setFilepath(path[0]);

      for (let i = 0; i < selectedRenders.length; i++) {
        dispatch({
          type: 'update_render',
          index: i,
          updates: { exportLocation: exportLocation.join('\\') },
        });
      }
    });
  }

  async function renderAll() {
    if (renderQueue.length === 0) {
      toast.warning('No renders in queue.');
      return;
    }

    let startedRenders: boolean[] = new Array(renderQueue.length).fill(false);

    let totalFrames = 0;
    let totalRenders = renderQueue.length;

    function callback(data: string) {
      // Split output by newlines and remove empty elements
      const outputLines = data.split('\n').filter((x) => !!x);

      outputLines.forEach((line) => {
        const renderInfo = processRender(line);

        if (renderInfo?.samples) setSamples(renderInfo.samples);
        if (renderInfo?.frame) setFrame([renderInfo.frame, totalFrames]);
      });
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
        propagateRender(index + 1);
      }
    }

    function errorCallback(index: number) {
      toast.error(`Error with render: ${renderQueue[index].filepath}`);
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

      setRenderNum([index + 1, totalRenders]);
      totalFrames = renderQueue[index].frameCount;

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

  function removeRenders() {
    const selectedRows = getSelectedRows ? getSelectedRows() : [0];

    queueViewRef.current?.deselectAll();

    // Iterate through selected rows in reverse, in order not to mess up later rows
    [...selectedRows].reverse().forEach((row) => {
      dispatch({
        type: 'remove_render',
        index: row,
      });
    });
  }

  useHotkeys('ctrl+i', handleUpload);
  useHotkeys('x', removeRenders);

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
                filePath={filepath}
                setFilePath={setFilepath}
                handleImport={handleUpload}
                handleSelectBlenderLocation={() => handleSelectBlenderLocation()}
                handleSelectExport={() => handleSelectExport()}
                renderAll={renderAll}
                selectAll={() => queueViewRef.current?.selectAll()}
                deselectAll={() => queueViewRef.current?.deselectAll()}
                removeRenders={removeRenders}
              />
              <QueueView
                ref={queueViewRef}
                columns={columns}
                data={data}
                className="rounded-md border flex-grow"
              />
              <RenderStatus
                className="mt-auto rounded-md border h-45 bg-background"
                currentTime={currentTime}
                samples={samples}
                frame={frame}
                renderNum={renderNum}
              />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
