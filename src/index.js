import { xhr } from "./util.js";

/*
muss auskommentiert werden damit kein fehler angezeigt wird


*/

class Statistic {
  /**
   *
   * @param {HTMLButtonElement} button
   * @param {HTMLSelectElement} select
   */
  constructor(button, select) {
    this.button = button;
    this.select = select;
  }

  init() {
    this.button.addEventListener("click", (event) => {
      this.clickBtn();
    });
    this.table = $("#stats-table").DataTable({
      columns: [
        { title: "Lat" },
        { title: "Long" },
        { title: "confirmed" },
        { title: "recovered." },
        { title: "Death" }
      ]
    });
  }

  clickBtn() {
    var self = this;
    xhr("https://covid-api.mmediagroup.fr/v1/cases?country=Germany").then(
      (statistic) => {
        self.updateView(statistic);
      }
    );
  }

  /**
   * Render the data
   */
  updateView(statistic) {
    this.table.clear();
    this.table.rows.add([Object.values(statistic[this.select.value])]);
    this.table.draw();
  }
}

/*function init() {
  let btn = document.getElementById("loadStats"); // var
  btn.addEventListener("click", clickBtn);
  //interaktionen von .js (funktion in einer funktion) (click, mousover...)
}

function clickBtn() {
  xhr("https://covid-api.mmediagroup.fr/v1/cases?country=Germany").then(
    (statistic) => {
      console.log(statistic);
    }
  );
}**/

let s = new Statistic(
  document.querySelector("#loadStats"),
  document.querySelector("[name=selectState]")
);
s.init();
