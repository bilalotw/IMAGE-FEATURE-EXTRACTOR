export default function get_data_url(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            const dataURL = reader.result
            const filename = file.name
            resolve({ filename, dataURL })
        }
    });
}