import { Component, createSignal, For } from "solid-js";
import { dialog, fs, tauri } from "@tauri-apps/api";
import { FileEntry } from "@tauri-apps/api/fs";

const extractFiles = (fileEntry: FileEntry) => {
  return fileEntry.children
    ? fileEntry.children.map(extractFiles)
    : tauri.convertFileSrc(fileEntry.path);
};

const App: Component = () => {
  const [files, setFiles] = createSignal<string[]>([]);

  const load = async () => {
    const dir = (await dialog.open({
      directory: true,
    })) as string;

    const data = await fs.readDir(dir, {
      recursive: true,
    });

    const pathes = data.map(extractFiles).flat(Infinity);
    setFiles(pathes);
  };

  return (
    <div>
      <button onClick={load}>load</button>

      <For each={files()}>{(file) => <img src={file} loading="lazy" />}</For>
    </div>
  );
};

export default App;
