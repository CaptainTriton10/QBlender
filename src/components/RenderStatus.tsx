import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';

type RenderStatusProps = {
  currentTime: number;
  samples: [number, number];
  frame: [number, number];
  renderNum: [number, number];
  className?: string;
};

// TODO: CPU/Mem stats
function RenderStatus(props: RenderStatusProps) {
  let renderProgress: number = props.samples[0] / props.samples[1];
  let totalProgress: number = (renderProgress + props.renderNum[0] - 1) / props.renderNum[1];

  return (
    <div className={props.className}>
      <div className="flex flex-row p-3 gap-3 ">
        <Badge variant="secondary">
          <b>Frame: </b>
          {props.frame[0]}/{props.frame[1]}
        </Badge>
        <Badge variant="secondary">
          <b>Time: </b>
          {props.currentTime}
        </Badge>
        <Badge variant="secondary">
          <b>Total Time: </b>31:05
        </Badge>
      </div>
      <Separator />
      <div className="p-3 flex flex-col place-content-stretch gap-3">
        <div>
          <p>
            <b>Current Render</b>
          </p>
          <Progress value={renderProgress * 100} />
          <p className="text-xs text-foreground/50">
            <b>Samples: </b>
            {props.samples[0]}/{props.samples[1]}
          </p>
        </div>
        <div>
          <p>
            <b>Total</b>
          </p>
          <Progress value={totalProgress * 100} />
          <p className="text-xs text-foreground/50">
            <b>Renders: </b>
            {props.renderNum[0]}/{props.renderNum[1]}
          </p>
        </div>
      </div>
    </div>
  );
}

export default RenderStatus;
