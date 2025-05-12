import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	// MenubarShortcut,
	MenubarTrigger,
} from "@/components/ui/menubar";
import { Separator } from "@/components/ui/separator.tsx";

async function HandleUpload() {
	const paths = await window.ipcRenderer.invoke("open_file");
	console.log(paths);
}

function AppQuit() {
	window.ipcRenderer.invoke("app_quit");
}

function Menu() {
	return (
		<>
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>File</MenubarTrigger>
					<MenubarContent>
						<MenubarItem onClick={HandleUpload}>Import</MenubarItem>
						<MenubarItem onClick={AppQuit}>Quit</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
				<Separator orientation="vertical" className="mx-1" />
				<MenubarMenu>
					<MenubarTrigger>Edit</MenubarTrigger>
					<MenubarContent>
						<MenubarItem>Select All</MenubarItem>
						<MenubarItem>Deselect All</MenubarItem>
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
