type Command = {
  command: string;
  args: string[];
};

type RenderItem = {
  file: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Error';
  frameCount: number;
  exportLocation: string;
  isAnimation: boolean;
};

export type { Command, RenderItem };
