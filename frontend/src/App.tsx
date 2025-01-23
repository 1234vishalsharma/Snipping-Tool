import "./App.css";
import html2canvas from "html2canvas";

import { useState } from "react";
function App() {
  const [btnHide, setbtnHide] = useState(false);
  const handleScreenCapture = () => {
    setbtnHide(true);
    const mainContent = document.body;
    document.body.style.cursor = "crosshair";
    let startX: any, startY: any, endX: any, endY: any, selectionBox: any;

    function onMouseMove(e: any) {
      e.preventDefault();
      endX = e.clientX;
      endY = e.clientY;

      const width = Math.abs(endX - startX);
      const height = Math.abs(endY - startY);

      selectionBox.style.width = `${width}px`;
      selectionBox.style.height = `${height}px`;
      selectionBox.style.left = `${Math.min(startX, endX)}px`;
      selectionBox.style.top = `${Math.min(startY, endY)}px`;
    }
    
    function onMouseDown(e: any){
      e.preventDefault();
      startX = e.clientX;
      startY = e.clientY;
      
      // Create a selection box
      selectionBox = document.createElement("div");
      selectionBox.className = "selection-box";
      selectionBox.style.left = `${startX}px`;
      selectionBox.style.top = `${startY}px`;
      mainContent.appendChild(selectionBox);
      
      mainContent.addEventListener("mousemove", onMouseMove);
    }

    // Mouse Down: Start selection
    mainContent.addEventListener("mousedown", onMouseDown);
    
    // Mouse Move: Resize the selection box
  
    // Mouse Up: Finalize selection
    mainContent.addEventListener("mouseup", function onMouseUp() {
      mainContent.removeEventListener("mousedown", onMouseDown);
      mainContent.removeEventListener("mousemove", onMouseMove);
      mainContent.removeEventListener("mouseup", onMouseUp); // Cleanup the listener
    
      if (selectionBox) {
        const rect = selectionBox.getBoundingClientRect();
    
        html2canvas(document.body, {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        }).then((canvas: any) => {
          const image = canvas.toDataURL("image/png");
          console.log("Captured Image:", image);
    
          const link = document.createElement("a");
          link.href = image;
          link.download = "screenshot.png";
          link.click();
    
          // Cleanup
          setbtnHide(false);
          selectionBox.remove();
          selectionBox = null;
          document.body.style.cursor = "default";
        }).catch((e: any) => {
          // Cleanup
          setbtnHide(false);
          selectionBox.remove();
          selectionBox = null;
          document.body.style.cursor = "default";
        });
      }
    });
  };
  return (
    <>
      <div className="flex flex-col justify-center gap-4 h-screen w-screen">
        <p className="text-3xl font-bold text-[#eeeee] text-center mt-4">
          Snipping Tool
        </p>
        <div className="flex justify-center">
          <button
            className={`${
              btnHide ? "hidden" : "block"
            }  text-purple-700 border border-purple-700 text-bold p-4 cursor-pointer hover:text-black hover:bg-purple-700`}
            onClick={handleScreenCapture}
          >
            Capture
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
