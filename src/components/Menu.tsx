import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarShortcut,
	MenubarTrigger,
} from "@/components/ui/menubar";
import { Separator } from "@/components/ui/separator.tsx";

async function HandleUpload() {
	const paths = await window.ipcRenderer.invoke("dialog:openFile");
	console.log(paths);
}

function Menu() {
	return (
		<>
			<Menubar>
				<MenubarMenu>s
					<MenubarTrigger>File</MenubarTrigger>
					<MenubarContent>
						<MenubarItem onClick={HandleUpload}>Import</MenubarItem>
						<MenubarItem>Quit</MenubarItem>
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
						<MenubarSeparator className="mx-1"/>
						<MenubarItem>Stop Render</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>
		</>
	);
}

export default Menu;
