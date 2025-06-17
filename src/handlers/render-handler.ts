import { blenderLocation } from '@/lib/utils';
import { Command, RenderItem } from '@/types.ts';
import { runCommand } from './command-handler';
import { toast } from 'sonner';

type RenderSettings = {
  isAnimation: boolean;
  frame: number;
  renderFormat: string;
};

class Render {
  public filepath: string;
  public renderLocation: string;
  public settings: RenderSettings;
  public frameCount: number;
  public status: 'Not Started' | 'In Progress' | 'Completed' | 'Error';
  public exportLocation: string;
  public exportName: string;

  public constructor(filepath: string, exportLocation: string, frame: number) {
    this.status = 'Not Started';
    this.filepath = filepath;
    this.exportLocation = exportLocation;
    this.frameCount = -1;
    this.exportName = 'untitled';
    this.settings = {
      isAnimation: false,
      frame: frame,
      renderFormat: 'PNG',
    };

    this.renderLocation = this._getRenderLocation();
  }

  private _getRenderLocation() {
    const splitFilepath = this.filepath.split('\\');
    const renderLocation = splitFilepath.slice(0, splitFilepath.length - 1);

    return renderLocation.join('\\');
  }

  public command() {
    const frame = this.settings.frame;
    const exportFile = `${this.exportLocation}\\${this.exportName}`;

    let command: Command = {
      command: blenderLocation,
      args: ['-b', this.filepath, '-o', exportFile, '-f', String(this.settings.frame)],
    };

    if (this.settings.frame) command.args.push(String(frame));

    return command;
  }

  public toRenderItem() {
    const splitFilename = this.filepath.split('\\');

    let renderItem: RenderItem = {
      file: splitFilename[splitFilename.length - 1].slice(0, -6),
      status: this.status,
      frameCount: this.frameCount,
      exportLocation: this.exportLocation,
    };

    return renderItem;
  }

  public async render(
    hasRun: React.MutableRefObject<boolean>,
    callback: (data: string) => void,
    closedCallback: () => void,
    errorCallback: () => void,
  ) {
    const command = this.command();
    console.log('Rendering blender file: ', this.filepath);

    console.log(command);

    runCommand(hasRun, command, callback, closedCallback, errorCallback);
  }

  public openExportLocation(hasRun: React.MutableRefObject<boolean>) {
    const command: Command = {
      command: 'explorer.exe',
      args: [this.exportLocation],
    };

    runCommand(
      hasRun,
      command,
      () => {},
      () => {},
      () => {
        toast.error('Error opening file explorer.');
      },
    );
  }

  public openRenderLocation(hasRun: React.MutableRefObject<boolean>) {
    console.log(this.renderLocation);

    const command: Command = {
      command: 'explorer.exe',
      args: [this.renderLocation],
    };

    runCommand(
      hasRun,
      command,
      () => {},
      () => {},
      () => {
        toast.error('Error opening file explorer.');
      },
    );
  }

  public cloneWith(updates: Partial<Render>) {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), { ...this, ...updates });
  }

  /**@deprecated */
  public toString() {
    let command: string = `\"${blenderLocation}\" -b \"${this.filepath}\"`;

    // this.args.forEach(arg => {
    //     command += ` ${arg}`;
    // });

    return command;
  }
}

export default Render;
