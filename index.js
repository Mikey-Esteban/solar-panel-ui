console.log("hello world");
let solarpanels = [];
let solarpanel = null;

const baseurl = "http://localhost:8080/api/solarpanel";

////////////////////    Private getters for material table row    //////////////
const getMaterialFromAbbr = (abbr) => {
  switch (abbr) {
    case "poly-Si":
      return "POLY_SI";
    case "mono-Si":
      return "MONO_SI";
    case "a-Si":
      return "A_SI";
    case "CdTe":
      return "CD_TE";
    case "CIGS":
      return "CIGS";
  }
}

const getAbbrFromMaterial = (material) => {
  switch (material) {
    case "POLY_SI":
      return "poly-Si";
    case "MONO_SI":
      return "mono-Si";
    case "A_SI":
      return "a-Si";
    case "CD_TE":
      return "CdTe";
    case "CIGS":
      return "CIGS";
  }
}

///////////////////////////////    RESETS    ////////////////////////////////////
const resetPanelsTable = () => {
  const allPanelsTable = document.querySelector(".allPanels");
  const tBody = allPanelsTable.tBodies[0];
  tBody.innerHTML = ``;
}

const resetInputValues = () => {
  const formContainer = document.querySelector(".formContainer");
  const nameInput = formContainer.querySelector(".nameInput").value = ``;
  const rowInput = formContainer.querySelector(".rowInput").value = ``;
  const columnInput = formContainer.querySelector(".columnInput").value = ``;
  const yearInstalledInput = formContainer.querySelector(".yearInstalledInput").value = ``;
}

const resetInputStatus = () => {
  const formContainer = document.querySelector(".formContainer");
  const nameInput = formContainer.querySelector(".nameInput");
  const rowInput = formContainer.querySelector(".rowInput");
  const columnInput = formContainer.querySelector(".columnInput");
  const yearInstalledInput = formContainer.querySelector(".yearInstalledInput");

  nameInput.classList = `input nameInput`;
  rowInput.classList = `input rowInput`;
  columnInput.classList = `input columnInput`;
  yearInstalledInput.classList = `input yearInstalledInput`;

  const nameMessage = document.querySelector(".nameMessage");
  nameMessage.classList = `help nameMessage`;
  nameMessage.textContent = ``;

  const rowMessage = document.querySelector(".rowMessage");
  rowMessage.classList = `help rowMessage`;
  rowMessage.textContent = ``;

  const columnMessage = document.querySelector(".columnMessage");
  columnMessage.classList = `help columnMessage`;
  columnMessage.textContent = ``;

  const yearInstalledMessage = document.querySelector(".yearInstalledMessage");
  yearInstalledMessage.classList = `help yearInstalledMessage`;
  yearInstalledMessage.textContent = ``;

  const trackingMessage = document.querySelector(".trackingMessage");
  trackingMessage.classList = `help trackingMessage`;
  trackingMessage.textContent = ``;
}

////////////////////////   Hiders and Showers (Table and form)    //////////////////////////
const hideFormAndTable = () => {
  const allPanelsTable = document.querySelector(".allPanels");
  const formContainer = document.querySelector(".formContainer");

  allPanelsTable.classList.add(`hidden`);
  formContainer.classList.add(`hidden`);
}

const showForm = () => {
  const formContainer = document.querySelector(".formContainer");
  formContainer.classList.remove(`hidden`);
}

///////////////////////     Creates      //////////////////////////////////////
const createPanelsTable = (solarpanels) => {

  const allPanelsTable = document.querySelector(".allPanels");
  const tBody = allPanelsTable.tBodies[0];

  const tableRows = solarpanels.map( (sp, i) => {

    const html =
      `<th>${i+1}</th>
        <td>${sp.section}</td>
        <td>${sp.row}-${sp.column}</td>
        <td>${sp.yearInstalled}</td>
        <td>${getAbbrFromMaterial(sp.material)}</td>
        <td>${sp.tracking ? "yes" : "no"}</td>
        <td><ion-icon name="create-outline" class="updatePanelLink solarpanel${sp.id}" style="cursor: pointer;""></ion-icon></td>
        <td><ion-icon name="trash-bin-outline" class="deletePanelLink solarpanel${sp.id}" style="cursor: pointer;"></ion-icon></td>
        `;

    let tr = tBody.insertRow(i);
    tr.innerHTML = html;
  });
}

///////////////////////// Click Handlers ///////////////////////////////////////
const handleAddPanelLinkClick = () => {
  // edit button class
  const submitButton = document.querySelector(".submitButton");
  submitButton.classList.remove('editing');

  resetInputValues();
  resetInputStatus();

  hideFormAndTable();
  showForm();
}

const handleUpdatePanelLinkClick = (p) => {
  // edit button class
  const submitButton = document.querySelector(".submitButton");
  submitButton.classList.add('editing');

  resetInputValues();
  resetInputStatus();

  const solarpanelClass = Array.from(p.classList).filter(c => c.includes("solarpanel"))[0];
  const id = solarpanelClass.split("solarpanel")[1];

  hideFormAndTable();
  showForm();

  solarpanel = solarpanels.filter(sp => sp.id == id)[0];

  const nameInput = formContainer.querySelector(".nameInput").value = solarpanel.section;
  const rowInput = formContainer.querySelector(".rowInput").value = solarpanel.row;
  const columnInput = formContainer.querySelector(".columnInput").value = solarpanel.column;
  const yearInstalledInput = formContainer.querySelector(".yearInstalledInput").value = solarpanel.yearInstalled;
  const materialInput = formContainer.querySelector(".materialInput").value = getAbbrFromMaterial(solarpanel.material);
  const trackingYesInput = formContainer.querySelector(".trackingYesInput");
  const trackingNoInput = formContainer.querySelector(".trackingNoInput");

  if (solarpanel.tracking) {
    trackingYesInput.checked = true;
    trackingNoInput.checked = false
  } else {
    trackingYesInput.checked = false;
    trackingNoInput.checked = true;
  }
}

const handleDeletePanel = (p) => {

  const solarpanelClass = Array.from(p.classList).filter(c => c.includes("solarpanel"))[0];
  const id = solarpanelClass.split("solarpanel")[1];

  solarpanel = solarpanels.filter(sp => sp.id == id)[0];

  doDelete(solarpanel.id);
}

///////////////////    Form input validation    ////////////////////////////////
const validateInputs = (nameInput, rowInput, columnInput, yearInstalledInput, trackingYesInput, trackingNoInput) => {
  let isError = false;
  resetInputStatus();

  if (nameInput.value.trim().length === 0) {
    nameInput.classList.add(`is-danger`);
    const nameMessage = document.querySelector(".nameMessage");
    nameMessage.classList.add(`is-danger`);
    nameMessage.textContent = `name cannot be blank`;
    isError = true;
  }

  if (rowInput.value.trim().length === 0) {
    rowInput.classList.add(`is-danger`);
    const rowMessage = document.querySelector(".rowMessage");
    rowMessage.classList.add(`is-danger`);
    rowMessage.textContent = `row cannot be blank`;
    isError = true;
  }

  if (columnInput.value.trim().length === 0) {
    columnInput.classList.add(`is-danger`);
    const columnMessage = document.querySelector(".columnMessage");
    columnMessage.classList.add(`is-danger`);
    columnMessage.textContent = `column cannot be blank`;
    isError = true;
  }

  if (yearInstalledInput.value.trim().length === 0) {
    yearInstalledInput.classList.add(`is-danger`);
    const yearInstalledMessage = document.querySelector(".yearInstalledMessage");
    yearInstalledMessage.classList.add(`is-danger`);
    yearInstalledMessage.textContent = `year installed cannot be blank`;
    isError = true;
  }

  if (!trackingYesInput.checked && !trackingNoInput.checked) {
    const trackingMessage = document.querySelector(".trackingMessage");
    trackingMessage.classList.add(`is-danger`);
    trackingMessage.textContent = `Must select a value for tracking`;
    isError = true;
  }

  return isError;
}

/////////////////////    Success or Error message on submit    /////////////////
const updateFormMessage = (message, isSuccess) => {
  const formMessageDiv = document.querySelector(".formMessage");
  formMessageDiv.classList.remove(`hidden`);
  const notificationDiv = formMessageDiv.querySelector(".notification");
  notificationDiv.classList = `notification`;
  notificationDiv.textContent = "";

  if (isSuccess) {
    notificationDiv.classList.add(`is-success`);
    notificationDiv.textContent = message;
  } else {
    notificationDiv.classList.add(`is-danger`);
    notificationDiv.textContent = message;
  }
  // TODO: theres a weird shadow that gets left behind
  setTimeout(() => {
    notificationDiv.classList.add(`hidden`);
    notificationDiv.classList = `notification`;
    notificationDiv.textContent = "";
  }, 4000);
}

const handleSubmitPanel = (isEditing) => {

  const formContainer = document.querySelector(".formContainer");
  const nameInput = formContainer.querySelector(".nameInput");
  const rowInput = formContainer.querySelector(".rowInput");
  const columnInput = formContainer.querySelector(".columnInput");
  const yearInstalledInput = formContainer.querySelector(".yearInstalledInput");
  const materialInput = formContainer.querySelector(".materialInput");
  const trackingYesInput = formContainer.querySelector(".trackingYesInput");
  const trackingNoInput = formContainer.querySelector(".trackingNoInput");

  const isError = validateInputs(nameInput, rowInput, columnInput, yearInstalledInput, trackingYesInput, trackingNoInput);
  if (isError) {
    return;
  }

  // create json object
  let panel =   {
    "section": nameInput.value,
    "row": rowInput.value,
    "column": columnInput.value,
    "yearInstalled": yearInstalledInput.value,
    "material": getMaterialFromAbbr(materialInput.value),
    "tracking": trackingYesInput.checked ? true : false
  }

  // if no id, its an add
  if (!isEditing) {
    post(panel);
  } else {
    panel.id = solarpanel.id;
    put(panel);
  }
}

//////////////////////////////     Event Listeners    //////////////////////////
const addFormEventListeners = () => {

  const submitButton = document.querySelector(".submitButton");
  submitButton.addEventListener("click", () => {
    if (submitButton.classList.contains("editing")) {
      handleSubmitPanel(true);
    } else {
      handleSubmitPanel(false);
    }
  });

  const cancelButton = document.querySelector(".cancelButton");
  cancelButton.addEventListener("click", () => {
    resetInputStatus();
    resetInputValues();

    hideFormAndTable();
    const allPanels = document.querySelector(".allPanels");
    allPanels.classList.remove(`hidden`);
  });

}

const addEventListeners = () => {

  const viewAllPanelsLink = document.querySelector(".allPanelsLink");
  const viewBySectionLink = document.querySelector(".viewBySectionLink");
  const addPanelLink = document.querySelector(".addPanelLink");
  const updatePanelLinks = document.querySelectorAll(".updatePanelLink");
  const deletePanelLinks = document.querySelectorAll(".deletePanelLink");

  viewAllPanelsLink.addEventListener("click", () => {
    hideFormAndTable();
    const allPanelsTable = document.querySelector(".allPanels");
    allPanelsTable.classList.remove(`hidden`);

    console.log("you clicked view all panels link");
    console.log("grabbing data from api...");
    getAll();
  });

  viewBySectionLink.addEventListener("click", () => {
    console.log("you clicked view by section link");
  });

  addPanelLink.addEventListener("click", () => {
    console.log("you clicked add panel link");
    handleAddPanelLinkClick();
  });

  Array.from(updatePanelLinks).map(p => {
    p.addEventListener("click", () => {
      console.log("you clicked update panel link");
      handleUpdatePanelLinkClick(p);
    });
  });

  Array.from(deletePanelLinks).map(p => {
    p.addEventListener("click", () => {
      console.log("you clicked delete panel link");
      handleDeletePanel(p);
    });
  });

  addFormEventListeners();
}

////////////////////////////////    API CALLS      /////////////////////////////
const getAll = async () => {

    const init = {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    };

    fetch(baseurl, init)
        .then(response => {
            if (response.status !== 200) {
                console.log(`Bad status: ${response.status}`);
                return Promise.reject("response is not 200 OK");
            }
            return response.json();
        })
        .then(json => {
          solarpanels = json;
          // populate table
          resetPanelsTable();
          createPanelsTable(json);
          addEventListeners();
        });
}

const getBySection = async (sectionName) => {

  const init = {
      method: "GET",
      headers: {
          "Accept": "application/json"
      }
  };

  fetch(`${baseurl}/section/${sectionName}`, init)
      .then(response => {
          if (response.status !== 200) {
              console.log(`Bad status: ${response.status}`);
              return Promise.reject("response is not 200 OK");
          }
          return response.json();
      })
      .then(json => console.log(json));
}

const getById = async (solarpanelId) => {

    const init = {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    };

    // includes a solarpanelId
    fetch(`${baseurl}/${solarpanelId}`)
        .then(response => {
            if (response.status === 404) {
                console.log("That solarpanel doesn't exist.");
                return;
            } else if (response.status !== 200) {
                console.log(`Bad status: ${response.status}`);
                return Promise.reject("response is not 200 OK");
            }
            return response.json();
        }).then(console.log);
}

const post = async (solarpanel) => {

    const init = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(solarpanel) // 2.
    };

    fetch(baseurl, init)
        .then(response => {
            if (response.status !== 201) {
                console.log("solarpanel is not valid.");
                updateFormMessage("solarpanel is not valid.", false);
                return Promise.reject("response is not 200 OK");
            }
            return response.json();
        }).then(json => {
          console.log("New solarpanel:", json);
          updateFormMessage("solarpanel created", true);
          resetInputValues();
        });
}

const put = async (solarpanel) => {

    const init = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(solarpanel)
    };

    fetch(`${baseurl}/${solarpanel.id}`, init)
        .then(response => {
            if (response.status === 404) {
                console.log("Solar panel not found.");
                updateFormMessage("Solar panel not found.", false);
            } else if (response.status === 204) {
                console.log("Solar panel updated!");
                updateFormMessage("Solar panel updated!", true);
            } else {
                console.log(`Solar panel id ${solarpanel.id} update failed with status ${response.status}.`);
                updateFormMessage(`Solar panel id ${solarpanel.id} update failed with status ${response.status}.`, false);
            }
        });
}

const doDelete = async (solarpanelId) => {
    fetch(`${baseurl}/${solarpanelId}`, { method: "DELETE" })
        .then(response => {
            if (response.status === 204) {
                console.log("Delete success.");
                updateFormMessage("Delete success", true);
                getAll();
            } else if (response.status === 404) {
                console.log("Solar panel not found.");
                updateFormMessage("Solar panel not found.", false);
            } else {
                console.log(`Delete failed with status: ${response.status}`);
                updateFormMessage(`Delete failed with status: ${response.status}`, false);
            }
        });
}


///////////////////////////////    INITIALIZATION    ///////////////////////////
const init = () => {

  getAll();
}


init();
