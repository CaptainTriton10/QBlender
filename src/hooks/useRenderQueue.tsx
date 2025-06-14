import Render from '@/handlers/render-handler';

export type RenderQueueAction =
  | {
      type: 'add_render';
      render: Render;
    }
  | {
      type: 'update_render';
      index: number;
      updates: Partial<Render>;
    }
  | {
      type: 'set_queue';
      queue: Render[];
    }
  | {
      type: 'remove_render';
      index: number;
    };

function renderQueueReducer(state: Render[], action: RenderQueueAction): Render[] {
  switch (action.type) {
    case 'add_render':
      return [...state, action.render];

    case 'remove_render':
      return state.filter((_, i) => i !== action.index);

    case 'update_render':
      return state.map((render, index) =>
        index === action.index ? render.cloneWith(action.updates) : render,
      );

    case 'set_queue':
      return action.queue;

    default:
      return state;
  }
}

export { renderQueueReducer };
