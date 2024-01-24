const initialData = [
    { id: 10, name: "Parcel 1", sequence: 1, location: "Mumbai" },
    { id: 11, name: "Parcel 2", sequence: 2, location: "Mumbai" },
    { id: 13, name: "Parcel 3", sequence: 3, location: "Mumbai" },
    { id: 19, name: "Parcel 4", sequence: 4, location: "Delhi" },
    { id: 18, name: "Parcel 5", sequence: 5, location: "Delhi" },
    { id: 21, name: "Parcel 6", sequence: 6, location: "Kolkata" },
    { id: 12, name: "Parcel 7", sequence: 7, location: "Kolkata" },
    { id: 22, name: "Parcel 8", sequence: 8, location: "Kolkata" },
    { id: 23, name: "Parcel 9", sequence: 9, location: "Kolkata" },
    { id: 24, name: "Parcel 10", sequence: 10, location: "Mumbai" },
    { id: 25, name: "Parcel 11", sequence: 11, location: "Mumbai" },
    { id: 31, name: "Parcel 12", sequence: 12, location: "Mumbai" },
    { id: 34, name: "Parcel 13", sequence: 13, location: "Mumbai" },
    { id: 35, name: "Parcel 14", sequence: 14, location: "Delhi" },
    { id: 41, name: "Parcel 15", sequence: 15, location: "Delhi" },
    { id: 42, name: "Parcel 16", sequence: 16, location: "Delhi" },
    { id: 43, name: "Parcel 17", sequence: 17, location: "Delhi" },
    { id: 44, name: "Parcel 18", sequence: 18, location: "Kolkata" },
    { id: 53, name: "Parcel 19", sequence: 19, location: "Kolkata" },
    { id: 57, name: "Parcel 20", sequence: 20, location: "Kolkata" }
];

let data = [...initialData];
let headerSizes = {};
let uniquelocations = new Set();
let headerRow; 
let headerRowWidth;

function renderParcels() {
    const appContainer = document.getElementById('parcels');
    const selectedParcelValue = document.getElementById('selected-parcel-value');
    const newParcelNameInput = document.getElementById('newParcelName');
    const newParcelLocationSelect = document.getElementById('newParcellocation');

    selectedParcelValue.textContent = '';
    headerRow = document.querySelector('.header-row');
    headerRowWidth = window.innerWidth > 768 ? 1080 : 335; 

    appContainer.innerHTML = '';
    selectedParcelValue.innerHTML = '';
    headerRow.innerHTML = '';

    uniquelocations.clear();

    data.forEach((parcel) => {
        if (!uniquelocations.has(parcel.location)) {
            createHeaderItem(parcel);
        }

        const headerItem = findHeaderItemByTextContent(headerRow, parcel.location);
        const parcelWidth = window.innerWidth > 768 ? 128 : 80;
        headerSizes[parcel.location] += parcelWidth;

        const parcelElement = createParcelElement(parcel, parcelWidth);
        appContainer.appendChild(parcelElement);
    });

    uniquelocations.forEach((location) => {
        const headerItem = findHeaderItemByTextContent(headerRow, location);
        const visibleParcels = getVisibleParcels(location);
        const visibleParcelsWidth = visibleParcels.reduce((totalWidth, parcel) => totalWidth + 132, 0);
        const percentageWidth = (visibleParcelsWidth / headerRowWidth) * 100;

        headerSizes[location] = percentageWidth;
        headerItem.style.width = `${headerSizes[location]}%`;
    });

    newParcelNameInput.value = '';
    newParcelLocationSelect.value = '';
}

function createHeaderItem(parcel) {
    const currentHeader = document.createElement('div');
    currentHeader.className = 'header-item';
    currentHeader.textContent = parcel.location;
    currentHeader.style.backgroundColor = getlocationColor(parcel.location);
    currentHeader.style.color = '#1B1506';

    headerRow.appendChild(currentHeader);

    uniquelocations.add(parcel.location);
    headerSizes[parcel.location] = 0;
}

function createParcelElement(parcel, parcelWidth) {
    const parcelElement = document.createElement('div');
    parcelElement.className = 'parcel';
    parcelElement.innerHTML = `
        <div class="parcel-content" data-id="${parcel.id}" data-sequence="${parcel.sequence}" data-name="${parcel.name}" data-location="${parcel.location}" style="${parcel.selected ? 'border: 2px dashed green;' : 'border: 2px dashed transparent;'} width: ${parcelWidth}px; text-align: center;">
            ${parcel.name}<br>
            <span class="sequence" style="background-color: ${getlocationColor(parcel.location)}; display: inline-block;">${parcel.sequence}</span>
        </div>
    `;

    parcelElement.addEventListener('click', () => handleParcelClick(parcel));
    return parcelElement;
}

// Function to find header item by text content (alternative to :contains)
function findHeaderItemByTextContent(headerRow, text) {
    const headerItems = headerRow.querySelectorAll('.header-item');
    for (const headerItem of headerItems) {
        if (headerItem.textContent.includes(text)) {
            return headerItem;
        }
    }
    return null;
}

// Function to get visible parcels for a location
function getVisibleParcels(location) {
    const parcels = document.querySelectorAll(`.parcel-content[data-location="${location}"]`);
    return Array.from(parcels).filter(parcel => isElementInViewport(parcel));
}

// Function to check if an element is in the viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Update header-item widths on scroll
window.addEventListener('scroll', () => {
    uniquelocations.forEach((location) => {
        const headerItem = findHeaderItemByTextContent(headerRow, location);
        if (headerItem) {
            const visibleParcels = getVisibleParcels(location);
            const visibleParcelsWidth = visibleParcels.reduce((totalWidth, parcel) => totalWidth + 132, 0);
            const percentageWidth = (visibleParcelsWidth / headerRowWidth) * 100;

            headerSizes[location] = percentageWidth;
            headerItem.style.width = `${headerSizes[location]}%`;
        }
    });
});


function handleParcelClick(selectedParcel) {
    const allParcels = document.querySelectorAll('.parcel-content');
    allParcels.forEach(parcel => {
        parcel.classList.remove('selected');
        parcel.style.border = '2px dashed transparent';
    });

    const clickedParcel = document.querySelector(`.parcel-content[data-id="${selectedParcel.id}"]`);
    clickedParcel.classList.add('selected');
    clickedParcel.style.border = '2px dashed green';

    const selectedParcelValue = document.getElementById('selected-parcel-value');
    selectedParcelValue.textContent = selectedParcel.name;
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
}

function updateOverlay(selectedParcel) {
    const overlay = document.querySelector('.overlay');
    const selectedParcelElement = document.querySelector(`.parcel-content[data-id="${selectedParcel.id}"]`);

    const rect = selectedParcelElement.getBoundingClientRect();
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    overlay.style.top = `${rect.top}px`;
    overlay.style.left = `${rect.left}px`;
}

function getlocationColor(location) {
    switch (location) {
        case 'Mumbai':
            return '#F0155E';
        case 'Delhi':
            return '#F1C233';
        case 'Kolkata':
            return '#3C78D8';
        default:
            return '#000000';
    }
}


function addParcelAfter(selectedParcel, newName, newlocation) {
    const newParcel = {
        id: generateUniqueId(),
        name: newName,
        sequence: selectedParcel.sequence + 1,
        location: newlocation,
    };

    data.forEach(parcel => {
        if (parcel.location === newParcel.location && parcel.sequence > selectedParcel.sequence) {
            parcel.sequence += 1;
        }
    });

    const insertIndex = data.findIndex(parcel => parcel.id === selectedParcel.id) + 1;
    data.splice(insertIndex, 0, newParcel);

    updateSequences(insertIndex + 1);

    renderParcels();
}

function addParcelBefore(selectedParcel, newName, newlocation) {
    const newParcel = {
        id: generateUniqueId(),
        name: newName,
        sequence: selectedParcel.sequence,
        location: newlocation,
    };

    data.forEach(parcel => {
        if (parcel.location === newParcel.location && parcel.sequence >= selectedParcel.sequence) {
            parcel.sequence += 1;
        }
    });

    const insertIndex = data.findIndex(parcel => parcel.id === selectedParcel.id);
    data.splice(insertIndex, 0, newParcel);

    updateSequences(insertIndex + 1);

    renderParcels();
}

function deleteParcel(selectedParcel) {

    const deleteIndex = data.findIndex(parcel => parcel.id === selectedParcel.id);
    const deletedSequence = data[deleteIndex].sequence;
    const location = data[deleteIndex].location;

    data.splice(deleteIndex, 1);
    updateSequences(deleteIndex);

    data.forEach((parcel, index) => {
        if (parcel.location === location && parcel.sequence > deletedSequence) {
            parcel.sequence = index + 1;
        }
    });
    renderParcels();
}

function replaceParcel(selectedParcel, newName, newlocation) {
    const newParcel = {
        id: generateUniqueId(),
        name: newName,
        sequence: selectedParcel.sequence,
        location: newlocation,
    };
    const replaceIndex = data.findIndex(parcel => parcel.id === selectedParcel.id);
    data.splice(replaceIndex, 1, newParcel);
    renderParcels();
}

function updateSequences(startIndex) {
    for (let i = startIndex; i < data.length; i++) {
        data[i].sequence = i + 1;
    }
}

function refreshParcels() {
    data = JSON.parse(JSON.stringify(initialData));
    renderParcels();
}

function showFinalData() {
    console.log('Final Data:', data);
}
function generateUniqueId() {
    return Math.floor(Math.random() * Date.now());
}

function addParcelAfterAction() {
    const selectedParcel = document.querySelector('.selected');
    const newName = document.getElementById('newParcelName').value.trim();
    const newlocation = document.getElementById('newParcellocation').value;

    if (!selectedParcel) {
        alert('Please select a parcel first.');
        return;
    }

    if (!newName || !newlocation) {
        alert('Please enter the name and select the location for the new parcel.');
        return;
    }

    const selectedParcelData = {
        id: parseInt(selectedParcel.dataset.id),
        name: selectedParcel.dataset.name,
        sequence: parseInt(selectedParcel.dataset.sequence),
        location: selectedParcel.dataset.location,
    };

    addParcelAfter(selectedParcelData, newName, newlocation);
}

function addParcelBeforeAction() {
    const selectedParcel = document.querySelector('.selected');
    const newName = document.getElementById('newParcelName').value.trim();
    const newlocation = document.getElementById('newParcellocation').value;

    if (!selectedParcel) {
        alert('Please select a parcel first.');
        return;
    }

    if (!newName || !newlocation) {
        alert('Please enter the name and select the location for the new parcel.');
        return;
    }

    const selectedParcelData = {
        id: parseInt(selectedParcel.dataset.id),
        name: selectedParcel.dataset.name,
        sequence: parseInt(selectedParcel.dataset.sequence),
        location: selectedParcel.dataset.location,
    };

    addParcelBefore(selectedParcelData, newName, newlocation);
}

function replaceParcelAction() {
    const selectedParcel = document.querySelector('.selected');
    const newName = document.getElementById('newParcelName').value.trim();
    const newlocation = document.getElementById('newParcellocation').value;

    if (!selectedParcel) {
        alert('Please select a parcel first.');
        return;
    }

    if (!newName || !newlocation) {
        alert('Please enter the name and select the location for the new parcel.');
        return;
    }

    const selectedParcelData = {
        id: parseInt(selectedParcel.dataset.id),
        name: selectedParcel.dataset.name,
        sequence: parseInt(selectedParcel.dataset.sequence),
        location: selectedParcel.dataset.location,
    };

    replaceParcel(selectedParcelData, newName, newlocation);
}

function deleteParcelAction() {
    const selectedParcel = document.querySelector('.selected');

    if (!selectedParcel) {
        alert('Please select a parcel first.');
        return;
    }

    const selectedParcelData = {
        id: parseInt(selectedParcel.dataset.id),
        name: selectedParcel.dataset.name,
        sequence: parseInt(selectedParcel.dataset.sequence),
        location: selectedParcel.dataset.location,
    };

    deleteParcel(selectedParcelData);
}

function showFinalData() {
    console.log('Final Data:', data);
}
renderParcels();