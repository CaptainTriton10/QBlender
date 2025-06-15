import { Button } from './ui/button';
import { Input } from './ui/input';
import { Folder } from 'lucide-react';

type FileSelectProps = {
  onFileSelect: () => void;
  filepath: string;
};

function FileSelect(props: FileSelectProps) {
  return (
    <div className="flex gap-3">
      <Button onClick={props.onFileSelect} variant="outline">
        <Folder />
      </Button>
      <Input placeholder="Select a folder..." value={props.filepath} />
    </div>
  );
}

export default FileSelect;
