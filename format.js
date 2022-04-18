// let fields = {
//     "name": "Shili", 
//     "rotation_period": "unknown", 
//     "orbital_period": "unknown", 
//     "diameter": "unknown", 
//     "climate": "temperate", 
//     "gravity": "1", 
//     "terrain": "cities, savannahs, seas, plains", 
//     "surface_water": "unknown", 
//     "population": "unknown", 
//     "residents": [
//         "https://swapi.dev/api/people/78/"
//     ], 
//     "films": [], 
//     "created": "2014-12-20T18:43:14.049000Z", 
//     "edited": "2014-12-20T20:58:18.521000Z", 
//     "url": "https://swapi.dev/api/planets/58/"
// }

// let keys = Object.keys(fields)

// let keys = ["name", "population", "rotational_period", "orbital_period", "diameter", "climate", "surface_water"]

// let objectName = "planet"

// let string = ""

// keys.forEach((key) => {
//     string+= `<td className = "td">{ ${objectName}.${key} }</td>`
//     string += "\n"
// })

// console.log(string)

let keys = ["name", "population", "rotational_period", "orbital_period", "diameter", "climate", "surface_water"]

let objectName = "graphOptions"

let string = ""

keys.forEach((key) => {
    string+= ` <Checkbox checked={${objectName}.${key}} className = "capitalize"  label="${key}" onChange={() => {handleCheckbox("${key}")}} />`
    string += "\n"
})

console.log(string)