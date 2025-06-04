type StatusBarProps = {
  className?: string;
  value: number;
};

function StatusBar(props: StatusBarProps) {
  return (
    <div className="bg-primary/20 rounded-full h-3.5 w-full">
      <div
        className="bg-primary rounded-full h-3.5 w-full"
        style={{ transform: `translateX(-${100 - (props.value || 0)}%)` }}
      ></div>
    </div>
  );
}

export default StatusBar;
