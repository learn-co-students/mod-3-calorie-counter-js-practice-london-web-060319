// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.
document.addEventListener("DOMContentLoaded", (event) => {
    getFetch()
})

const form = document.querySelector("#new-calorie-form")

const postFetch = (cal, no) => {
    fetch("http://localhost:3000/api/v1/calorie_entries", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Accept": "application/json"
        },
        body: JSON.stringify ({
            calorie: cal,
            note: no
        })
    })
    .then(resp => resp.json())
    .then(record => {
        createRecords(record)
    })
}
const submitRecord = (event) => {
    event.preventDefault()
    const calorie = event.target[0].value
    const note = event.target[1].value
    postFetch(calorie, note)
}

form.addEventListener("submit", submitRecord)

const ul_list = document.querySelector("#calories-list")

const calorieDelete = (event) => {
    const item = event.currentTarget.dataset.id
    fetchRecordDelete(item)
}

const deleteRecordDOM = (id) => {

    const array = document.querySelectorAll('li.calories-list-item')
    array.forEach(found => {
        if (found.dataset.id == id) {
            found.remove()
        } 
    })
}

const fetchRecordDelete = (id) => {
    fetch(`http://localhost:3000/api/v1/calorie_entries/${id}`, {
        method: "DELETE"
    })
    .then(resp => resp.json())
    .then(record => {
        deleteRecordDOM(record.id)
    })
}

const createRecords = (record) => {
    const newLi = document.createElement("li")
    newLi.className = "calories-list-item"
    newLi.dataset.id = record.id

        const newDivUkGrid = document.createElement("div")
        newDivUkGrid.className = "uk-grid"
            const newDivUkWidth1 = document.createElement("div")
            newDivUkWidth1.className = "uk-width-1-6"
                const newStrong = document.createElement("strong")
                newStrong.innerText = record.calorie
                const newSpan = document.createElement("span")
                newSpan.innerText = "kcal"
            const newDivUkWidth2 = document.createElement("div")
            newDivUkWidth2.className = "uk-width-4-5"
                const newEm = document.createElement("em")
                newEm.className = "uk-text-meta"
                newEm.innerText = record.note
        const newDivItemMenu = document.createElement("div")
        newDivItemMenu.className = "list-item-menu"
        newDivItemMenu.innerHTML = `
            <a class="edit-button" uk-icon="icon: pencil" uk-toggle="target: #edit-form-container"></a>
            <a class="delete-button" uk-icon="icon: trash"></a>
            `
            const binButton = newDivItemMenu.lastElementChild
            binButton.addEventListener("click", calorieDelete)
            binButton.dataset.id = record.id

    const updated_li = ul_list.appendChild(newLi)
    const updated_ndug = updated_li.appendChild(newDivUkGrid)
    const updated_newDivUkWidth1 = updated_ndug.appendChild(newDivUkWidth1)
    updated_newDivUkWidth1.appendChild(newStrong)
    updated_newDivUkWidth1.appendChild(newSpan)
    updated_ndug.appendChild(newDivUkWidth2).appendChild(newEm)
    updated_li.appendChild(newDivItemMenu)
}

const appendRecord  = (array) => {
    array.forEach(element => {
        createRecords(element)
    });
}

const getFetch = () => {
    fetch("http://localhost:3000/api/v1/calorie_entries")
    .then(resp => resp.json())
    .then(items => {
        appendRecord(items)
    })
}

// -----

const bmrForm = document.querySelector("#bmr-calulator")

const lowerBMRRange = (weight, height, age) => {
    return 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age)
}

const upperBMRRange = (weight, height, age) => {
    return 66 + (6.23 * weight) + (12.7 * height) - (6.8 * age)
}

const avgNumber = (low, high) => {
    return (low + high) / 2
}

const updateProgressBarDOM = (low, high) => {
    const max = document.querySelector(".uk-progress").attributes[2]
    const val = document.querySelector(".uk-progress").attributes[1]
    const lower_range = document.querySelector("#lower-bmr-range")
    const higher_range = document.querySelector("#higher-bmr-range")
    lower_range.innerText = Math.floor(low)
    higher_range.innerText = Math.floor(high)
    const returned_max = avgNumber(low, high)
    val.value = high
    max.value = returned_max
}

const calculateBMR = (event) => {
    event.preventDefault()
    let bmr = []
    const weight = event.target.weight.value
    const height = event.target.height.value
    const age  = event.target.age.value
    const low = lowerBMRRange(weight, height, age)
    const high = upperBMRRange(weight, height, age)
    updateProgressBarDOM(low, high)
}

bmrForm.addEventListener("submit", calculateBMR)

