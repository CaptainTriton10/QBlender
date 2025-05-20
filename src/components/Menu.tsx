import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarShortcut,
	// MenubarShortcut,
	MenubarTrigger,
} from "@/components/ui/menubar";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectItem,
	SelectContent
} from "./ui/select";
import { Separator } from "@/components/ui/separator.tsx";
import { useHotkeys } from "react-hotkeys-hook";
import FilePathView from "./FilePathView";
import { Button } from "./ui/button";
import { useState } from "react";

function AppQuit() {
	window.ipcRenderer.invoke("app_quit");
}

type MenuProps = {
	handleImport: () => void;
	handleSelectExport: () => void;
	selectAll: () => void;
	deselectAll: () => void;
}

function Menu(props: MenuProps) {
	const [open, setOpen] = useState(false);

	const ToggleOpen = () => {
		setOpen(!open);
	}

	useHotkeys("ctrl+q", AppQuit);
	useHotkeys("p", ToggleOpen);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>File</MenubarTrigger>
					<MenubarContent>
						<MenubarItem onClick={() => props.handleImport()}>
							Import<MenubarShortcut>Ctrl+I</MenubarShortcut>
						</MenubarItem>
						<MenubarItem onClick={AppQuit}>
							Quit<MenubarShortcut>Ctrl+Q</MenubarShortcut>
						</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
				<Separator orientation="vertical" className="mx-1" />
				<MenubarMenu>
					<MenubarTrigger>Edit</MenubarTrigger>
					<MenubarContent>
						<MenubarItem onClick={() => props.selectAll()}>
							Select All<MenubarShortcut>A</MenubarShortcut>
						</MenubarItem>
						<MenubarItem onClick={() => props.deselectAll()}>
							Deselect All<MenubarShortcut>Alt+A</MenubarShortcut>
						</MenubarItem>
						<MenubarSeparator className="mx-1" />
						<DialogTrigger asChild>
							<MenubarItem>
								Render Properties<MenubarShortcut>P</MenubarShortcut>
							</MenubarItem>
						</DialogTrigger>
					</MenubarContent>
				</MenubarMenu>
				<Separator orientation="vertical" className="mx-1" />
				<MenubarMenu>
					<MenubarTrigger>Render</MenubarTrigger>
					<MenubarContent>
						<MenubarItem>Render All</MenubarItem>
						<MenubarItem>Render Selection</MenubarItem>
						<MenubarSeparator className="mx-1" />
						<MenubarItem>Stop Render</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Render Properties</DialogTitle>
					<DialogDescription>
						Change the properties of this render.
					</DialogDescription>
					<Separator className="my-3" />
					<div className="flex flex-col">
						<div>
							<h3 className="my-3">Export Location</h3>
							<div className="flex flex-row items-center justify-between">
								<FilePathView filePath={"C:\\Documents\\Blender\\Render"} />
								<Button onClick={() => props.handleSelectExport()}>Select...</Button>
							</div>
						</div>
						<div>
							<h3 className="my-3">Render Format</h3>
							<RenderFormatSelector />
						</div>
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button>Save</Button>
						</DialogClose>
					</DialogFooter>
				</DialogHeader>
			</DialogContent>
		</ Dialog >
	);
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
				<SelectItem value="OPEN_EXR_MULTILAYER">
					EXR Multilayer
				</SelectItem>
				<SelectItem value="OPEN_EXR">EXR</SelectItem>
				<SelectItem value="HDR">HDR</SelectItem>
			</SelectContent>
		</Select>
	);
}

export default Menu;
