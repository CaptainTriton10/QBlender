import Render from "@/handlers/RenderHandler";

export type RenderQueueAction = {
    type: "add_render";
    render: Render;
} | {
    type: "update_render";
    index: number;
    updates: Partial<Render>;
} | {
    type: "set_queue";
    queue: Render[];
}

function RenderQueueReducer(state: Render[], action: RenderQueueAction): Render[] {
    switch (action.type) {
        case "add_render":
            return [...state, action.render];

        case "update_render":
            return state.map((render, index) =>
                index === action.index ? render.CloneWith(action.updates) : render
            )

        case "set_queue":
            return action.queue;

        default:
            return state;
    }
}

export { RenderQueueReducer };