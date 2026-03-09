if(localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "index.html"; 
}

const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const container = document.getElementById("issuesContainer");
const issueCountEl = document.getElementById("issueCount");

function showLoader(show){
    let loader = document.getElementById("loader");
    if(!loader){
        loader = document.createElement("div");
        loader.id = "loader";
        loader.className = "fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-50";
        loader.innerHTML = `<div class="loader border-t-4 border-b-4 border-blue-500 w-12 h-12 rounded-full animate-spin"></div>`;
        document.body.appendChild(loader);
    }
    loader.style.display = show ? "flex" : "none";
}

function getPriorityColor(priority){
    if(priority.toUpperCase() === "HIGH") return "bg-red-100 text-red-600";
    if(priority.toUpperCase() === "MEDIUM") return "bg-yellow-100 text-yellow-600";
    if(priority.toUpperCase() === "LOW") return "bg-green-100 text-green-700";
    return "bg-gray-200 text-gray-700";
}

function getLabelColor(label){
    if(label.toLowerCase().includes("bug")) return "bg-red-100 text-red-600";
    if(label.toLowerCase().includes("help")) return "bg-yellow-100 text-yellow-600";
    return "bg-gray-200 text-gray-700";
}

function displayIssues(issues){
    container.innerHTML = "";
    if(issues.length === 0){
        container.innerHTML = "<p class='text-gray-500'>No issues found. </p>";
        return;
    }

    issues.forEach(issue => {
    const borderColor = issue.status.toLowerCase() === "open" ? "bg-green-500" : "bg-purple-500";
    const priorityColor = getPriorityColor(issue.priority);
    let labelsHTML = "";
    if(issue.labels && issue.labels.length){
    labelsHTML = issue.labels.map(l=>`<span class="px-2 py-0.5 rounded text-xs ${getLabelColor(l)}"> ${l} </span>`).join(" ");
    }

const card = document.createElement("div");
 card.className = "border rounded shadow-sm bg-white cursor-pointer";
 card.innerHTML = `
    <div class="h-1 ${borderColor} rounded-t"> </div>
     <div class="p-3 flex flex-col gap-2">
     <div class="flex justify-between items-start">
    <h3 class="font-semibold text-sm"> ${issue.title} </h3>
    <span class="text-xs px-2 py-0.5 rounded ${priorityColor}"> ${issue.priority} </span>
    </div>

     <p class="text-xs text-gray-500"> ${issue.description} </p>
    <div class="flex gap-2 text-xs mt-1"> ${labelsHTML} </div>
    <hr>
    <p class="text-xs text-gray-400 mt-2"> #${issue.id} by ${issue.author} <br> ${issue.createdAt} </p>
    </div>
        `;
        card.addEventListener("click", ()=> openModal(issue, borderColor, priorityColor, labelsHTML));
        container.appendChild(card);
    });
}

function setActiveTab(tabName, issues){
    const tabs = ["AllBtn","OpenBtn","ClosedBtn"];
    tabs.forEach(id=>{
        const btn = document.getElementById(id);
        if(btn.id === tabName+"Btn"){
            btn.classList.remove("bg-gray-200","text-gray-700");
            btn.classList.add("bg-[#4A00FF]","text-white");
        } else {
            btn.classList.remove("bg-[#4A00FF]","text-white");
            btn.classList.add("bg-gray-200","text-gray-700");
        }
    });

    issueCountEl.innerText = `${issues.length} Issues`;
}

let allIssues = [];
async function loadIssues(){
    showLoader(true);

try {
    const res = await fetch(API);
    const data = await res.json();
    allIssues = data.data;
    displayIssues(allIssues);
    setActiveTab("All", allIssues);
    } catch(e){
     container.innerHTML = "<p class='text-red-500'> Failed to load issues. </p>";

    }
    showLoader(false);
}

function filterIssues(status){
    let filtered = [];
    if(status === "All") filtered = allIssues;
    else filtered = allIssues.filter(i=> i.status.toLowerCase() === status.toLowerCase());
    displayIssues(filtered);
    setActiveTab(status, filtered);
}

async function searchIssues(){
    const text = document.getElementById("searchInput").value.trim();
    if(!text) return displayIssues(allIssues);

    showLoader(true);
    try{
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`);
        const data = await res.json();
        displayIssues(data.data);
        setActiveTab("All", data.data);
    } catch(e){
        container.innerHTML = "<p class='text-red-500'>Search failed. </p>";
    }
    showLoader(false);
}

function openModal(issue, borderColor, priorityColor, labelsHTML){
    const modal = document.getElementById("issueModal");
    const modalContent = document.getElementById("modalContent");
    modalContent.innerHTML = `
        <div class="h-1 ${borderColor} rounded-t"> </div>
        <div class="p-3 flex flex-col gap-2">
        <div class="flex justify-between items-start">
        <h3 class="font-semibold text-sm"> ${issue.title} </h3>
        <span class="text-xs px-2 py-0.5 rounded ${priorityColor}"> ${issue.priority} </span>
         </div>
        <p class="text-xs text-gray-500"> ${issue.description} </p>
         <div class="flex gap-2 text-xs mt-1"> ${labelsHTML} </div>
        <hr>
        <p class="text-xs text-gray-400 mt-2">#${issue.id} by ${issue.author} <br> ${issue.createdAt} </p>
        </div>
        <button onclick="closeModal()" class="absolute top-2 right-2 text-gray-500 hover:text-black">
            <i class="fas fa-times"> </i>
        </button>
    `;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

function closeModal(){
    document.getElementById("issueModal").classList.add("hidden");
}

loadIssues();