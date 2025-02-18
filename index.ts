interface WindowData {
  top: number;
  left: number;
  width: number;
  height: number;
}

// Count
localStorage.setItem(
  "windowCount",
  (Number(localStorage.getItem("windowCount")) + 1).toString()
);

window.addEventListener("unload", () => {
  localStorage.setItem(
    "windowCount",
    Math.max(Number(localStorage.getItem("windowCount")) - 1, 0).toString()
  );
});

// Number
const windowNumber = sessionStorage.getItem("windowNumber")
  ? Number(sessionStorage.getItem("windowNumber"))
  : Number(localStorage.getItem("windowCount"));

sessionStorage.setItem("windowNumber", windowNumber.toString());

// Set window position
const setWindowPosition = () => {
  const windowsPositions = JSON.parse(
    localStorage.getItem("windowsPositions") ?? "{}"
  );
  const data: WindowData = {
    top: window.screenTop,
    left: window.screenLeft,
    width: window.innerWidth,
    height: window.innerHeight,
  };

  windowsPositions[windowNumber] = data;

  localStorage.setItem("windowsPositions", JSON.stringify(windowsPositions));
};

window.addEventListener("unload", () => {
  const windowsPositions: Record<string, WindowData> = JSON.parse(
    localStorage.getItem("windowsPositions") ?? "{}"
  );

  delete windowsPositions[windowNumber];

  localStorage.setItem("windowsPositions", JSON.stringify(windowsPositions));
});

setInterval(setWindowPosition, 10);
setWindowPosition();

// Insert divs
const createDiv = (top: number, left: number) => {
  const div = document.createElement("div");

  div.style.width = "300px";
  div.style.height = "300px";
  div.style.backgroundImage = "url(/logo.svg)";
  div.style.backgroundSize = "contain";
  div.style.backgroundRepeat = "no-repeat";
  div.style.backgroundPosition = "center";
  div.style.position = "fixed";
  div.style.top = `${top}px`;
  div.style.left = `${left}px`;
  div.style.transform = "translate(-50%, -50%)";

  document.getElementById("app")!.appendChild(div);
};

const insertDivs = () => {
  const app = document.getElementById("app");

  if (app) {
    app.innerHTML = "";
  }

  const windowsPositions: Record<string, WindowData> = JSON.parse(
    localStorage.getItem("windowsPositions") ?? "{}"
  );
  const data = windowsPositions[windowNumber];

  createDiv(data.height / 2, data.width / 2);

  const globalMainX = data.left + data.width / 2;
  const globalMainY = data.top + data.height / 2;

  const otherNumbers = Object.keys(windowsPositions).filter(
    (number) => number !== windowNumber.toString()
  );

  otherNumbers.forEach((i) => {
    const logoData = windowsPositions[i];
    const mainX = logoData.left + logoData.width / 2;
    const mainY = logoData.top + logoData.height / 2;
    const centerX = data.width / 2 + (mainX - globalMainX);
    const centerY = data.height / 2 + (mainY - globalMainY);

    createDiv(centerY, centerX);
  });
};

setInterval(insertDivs, 10);
