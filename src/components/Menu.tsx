import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Separator } from '@/components/ui/separator.tsx';
import { CircleAlert } from 'lucide-react';
import { Dispatch, PropsWithChildren, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'sonner';
import FileSelect from './FileSelect';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';

function AppQuit() {
  window.ipcRenderer.invoke('app_quit');
}

type MenuProps = {
  saveRenders: () => void;
  loadRenders: () => void;
  handleImport: () => void;
  handleSelectExport: () => void;
  handleSelectBlenderLocation: () => void;
  setRenderNames: (name: string) => void;
  removeRenders: () => void;
  renderAll: () => void;
  renderSelected: () => void;
  selectAll: () => void;
  deselectAll: () => void;
  openExportLocation: () => void;
  openRenderLocation: () => void;
  setIsAnimation: (isAnimation: boolean) => void;
  filepath: string;
  setFilePath: Dispatch<React.SetStateAction<string>>;
};

type MenuDialogProps = {
  menuProps: MenuProps;
  dialogState: string;
};

type SettingsRowProps = {
  title?: string;
  titleElement?: any;
};

function Menu(props: MenuProps) {
  const [open, setOpen] = useState(false);
  const [dialogState, setDialogState] = useState<string>('render_properties');

  function ToggleOpen() {
    setOpen(!open);
  }

  useHotkeys('ctrl+q', AppQuit);
  useHotkeys('p', ToggleOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={props.handleImport}>
              Import<MenubarShortcut>Ctrl+I</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={props.saveRenders}>Save Queue</MenubarItem>
            <MenubarItem onClick={props.loadRenders}>Load Queue</MenubarItem>
            <MenubarItem onClick={AppQuit}>
              Quit<MenubarShortcut>Ctrl+Q</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator className="mx-1" />
            <DialogTrigger asChild>
              <MenubarItem onClick={() => setDialogState('settings')}>Settings</MenubarItem>
            </DialogTrigger>
          </MenubarContent>
        </MenubarMenu>
        <Separator orientation="vertical" className="mx-1" />
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <DialogTrigger asChild>
              <MenubarItem onClick={() => setDialogState('render_properties')}>
                Render Properties<MenubarShortcut>P</MenubarShortcut>
              </MenubarItem>
            </DialogTrigger>
            <MenubarSeparator className="mx-1" />
            <MenubarItem onClick={props.selectAll}>
              Select All<MenubarShortcut>A</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={props.deselectAll}>
              Deselect All<MenubarShortcut>Alt+A</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator className="mx-1" />
            <MenubarItem onClick={props.removeRenders}>
              Delete Selected<MenubarShortcut>X</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <Separator orientation="vertical" className="mx-1" />
        <MenubarMenu>
          <MenubarTrigger>Render</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={props.renderAll}>Render All</MenubarItem>
            <MenubarItem onClick={props.renderSelected}>Render Selected</MenubarItem>
            <MenubarSeparator className="mx-1" />
            <MenubarItem>Stop Render</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <Separator orientation="vertical" className="mx-1" />
        <MenubarMenu>
          <MenubarTrigger>Actions</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={props.openExportLocation}>Open Export Location</MenubarItem>
            <MenubarItem onClick={props.openRenderLocation}>Open Render Location</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <MenuDialog menuProps={props} dialogState={dialogState} />
    </Dialog>
  );
}

function SettingsRow(props: PropsWithChildren<SettingsRowProps>) {
  if (props.titleElement) {
    return (
      <div>
        {props.titleElement}
        {props.children}
      </div>
    );
  } else {
    return (
      <div>
        <h3 className="my-3">{props.title ? props.title : 'undefined'}</h3>
        {props.children}
      </div>
    );
  }
}

function MenuDialog(props: MenuDialogProps) {
  const [filenameTooltipOpen, setFileNameTooltipOpen] = useState(false);
  const [animationSwitch, setAnimationSwtich] = useState(false);

  if (props.dialogState == 'render_properties') {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Render Properties</DialogTitle>
          <DialogDescription>Change the properties of this render.</DialogDescription>
          <Separator className="mt-3" />
          <div className="flex flex-col gap-3">
            <SettingsRow title="Export Location">
              <FileSelect
                onFileSelect={props.menuProps.handleSelectExport}
                filepath={props.menuProps.filepath}
              />
            </SettingsRow>
            <SettingsRow
              titleElement={
                <div className="flex">
                  <h3 className="my-3">File Name</h3>
                  <Popover open={filenameTooltipOpen}>
                    <PopoverTrigger style={{ outline: 'none' }}>
                      <CircleAlert
                        className="w-5 h-5 ml-3 self-center"
                        onMouseEnter={() => setFileNameTooltipOpen(true)}
                        onMouseLeave={() => setFileNameTooltipOpen(false)}
                      />
                    </PopoverTrigger>
                    <PopoverContent>
                      To add the frame number to the filename, use hashtags, e.g: "
                      {<code>Example1-##-test</code>}" or "{<code>Example2_####</code>}". The file
                      extension does not need to be added.
                    </PopoverContent>
                  </Popover>
                </div>
              }
            >
              <Input
                placeholder="File name..."
                onChange={(event) => {
                  props.menuProps.setRenderNames(event.target.value);
                }}
              />
            </SettingsRow>
            <SettingsRow title="Render Type">
              <div className="flex gap-3">
                <Badge variant={animationSwitch ? 'outline' : 'default'} aria-disabled>
                  Image
                </Badge>
                <Switch
                  onCheckedChange={() => {
                    props.menuProps.setIsAnimation(!animationSwitch);
                    console.log(!animationSwitch);
                    setAnimationSwtich(!animationSwitch);
                  }}
                  className="self-center"
                />
                <Badge variant={animationSwitch ? 'default' : 'outline'}>Animation</Badge>
              </div>
            </SettingsRow>
            <SettingsRow title="Render Format">
              <RenderFormatSelector />
            </SettingsRow>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    );
  } else if (props.dialogState == 'settings') {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Change global QBlender settings.</DialogDescription>
          <Separator className="my-3" />
          <div className="flex flex-col">
            <div>
              <h3 className="my-3">Blender Install Location</h3>
              <div className="flex flex-row items-center justify-between">
                <FileSelect
                  filepath={props.menuProps.filepath}
                  onFileSelect={props.menuProps.handleSelectBlenderLocation}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={() => toast.info('Restart QBlender for effects to take place.')}>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    );
  }
}

function RenderFormatSelector() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="PNG" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PNG">PNG</SelectItem>
        <SelectItem value="JPEG">JPEG</SelectItem>
        <SelectItem value="FFMPEG">FFMPEG</SelectItem>
        <SelectItem value="AVIJPEG">AVI</SelectItem>
        <SelectItem value="WEBP">WEBP</SelectItem>
        <SelectItem value="OPEN_EXR_MULTILAYER">EXR Multilayer</SelectItem>
        <SelectItem value="OPEN_EXR">EXR</SelectItem>
        <SelectItem value="HDR">HDR</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default Menu;
