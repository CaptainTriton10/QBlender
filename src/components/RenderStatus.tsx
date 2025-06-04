import { Progress } from './ui/progress';

type RenderStatusProps = {
  className?: string;
};

function RenderStatus(props: RenderStatusProps) {
  return (
    <div className={props.className}>
      <Progress value={0} />
    </div>
  );
}

export default RenderStatus;
