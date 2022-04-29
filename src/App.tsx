import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  Signal,
} from "solid-js";
import downloadCanvas from "./downloadCanvas";

const App: Component = () => {
  const [text, setText] = createSignal("");

  const [people, setPeople] = createSignal<Signal<string>[]>([]);

  const peopleString = createMemo(() => {
    return people()
      .map((p) => p[0]())
      .join(" / ");
  });

  let canvasEl: HTMLCanvasElement = null!;

  createEffect(() => {
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvasEl.width,
      canvasEl.height
    );
    gradient.addColorStop(0, "#1565c0");
    gradient.addColorStop(1, "#006064");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    ctx.font = "600 200px Amatic SC";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
      "Baptist Piano",
      canvasEl.width / 2,
      canvasEl.height / 2 - 250
    );

    ctx.font = "140px Amatic SC";
    ctx.fillText(text(), canvasEl.width / 2, canvasEl.height / 2 + 75);

    ctx.font = "80px Amatic SC";
    ctx.textAlign = "end";
    ctx.fillText(peopleString(), canvasEl.width - 100, canvasEl.height - 100);
  });

  return (
    <main class="bg-gray-200 h-full flex flex-col lg:flex-row">
      <div class="w-240 p-4">
        <h1 class="text-lg text-center p-4">
          Baptist Piano Thumbnail Generator
        </h1>

        <label class="block text-gray-700 text-sm font-bold mb-2 p-2">
          <p class="mb-2">Enter the text you want to use for the thumbnail:</p>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={text()}
            onInput={(e) => setText(e.currentTarget.value)}
          />
        </label>

        <label class="block text-gray-700 text-sm font-bold mb-2 p-2">
          <p class="mb-2">People / Role (separate with newline):</p>
          <textarea
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
            value={people()
              .map((p) => p[0]())
              .join("\n")}
            onInput={(e) =>
              setPeople(
                e.currentTarget.value.split("\n").map((p) => createSignal(p))
              )
            }
            placeholder={`Ex\nPiano: Zachiah\nVocals: Abriella`}
          />
        </label>

        <button
          class=" w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => {
            downloadCanvas(canvasEl, `${text()}.png`);
          }}
        >
          Generate PNG
        </button>
      </div>

      <div class="p-4">
        <canvas
          ref={canvasEl}
          class="mt-2 w-full h-auto"
          width="1600"
          height="900"
        />
      </div>
    </main>
  );
};

export default App;
