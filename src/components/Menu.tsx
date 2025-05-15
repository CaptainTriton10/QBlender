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
import { Separator } from "@/components/ui/separator.tsx";
import { useHotkeys } from "react-hotkeys-hook";

function AppQuit() {
	window.ipcRenderer.invoke("app_quit");
}

type MenuProps = {
	handleImport: () => void;
	selectAll: () => void;
	deselectAll: () => void;
}

function Menu(props: MenuProps) {
	useHotkeys("ctrl+q", () => AppQuit());

	return (
		<>
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
		</>
	);
}

export default Menu;
