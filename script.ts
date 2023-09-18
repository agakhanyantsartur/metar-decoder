const decodeBtn = document.getElementById('btn');
const metarCodeInput = document.getElementById('metarCode') as HTMLInputElement;
const metarDecodeOutput = document.getElementById('metarDecode');

decodeBtn?.addEventListener('click', () => {
    const metarCode = metarCodeInput.value;
    const metarDecode = decodeMETAR(metarCode);

    if (metarDecodeOutput) {
        metarDecodeOutput.textContent = metarDecode;
    }
});

function decodeMETAR(metarCode: string): string {
    function decodeInternalMETAR(metarCode) {
        const decodedMetar = {
            airport: '',
            timestamp: '',
            visibility: '',
            wind: '',
            cloudCover: '',
            temperature: '',
            dewPoint: '',
            pressure: '',
            remarks: ''
        };
    
        // Разбиваем код METAR на отдельные секции, используя регулярные выражения
        const sections = metarCode.match(/([A-Z\d]+ [A-Z\d]+|[A-Z\d]+|[-+]?\d+\.\d+|\d+)/g);
    
        // Расшифровываем аэропорт и временную метку
        if (sections && sections.length >= 2) {
            decodedMetar.airport = sections[0];
            decodedMetar.timestamp = sections[1];
        }
    
        // Здесь будет код для расшифровки других параметров METAR,
        // таких как видимость, ветер, облачность и так далее.
    
        if (sections && sections.length >= 4) {
            decodedMetar.visibility = sections[2];
            decodedMetar.wind = sections[3];
        }
        // Расшифровываем аэропорт и временную метку
        if (sections && sections.length >= 2) {
            decodedMetar.airport = sections[0];
            decodedMetar.timestamp = sections[1];
        }
        
        // Расшифровываем видимость и ветер
        if (sections) {
            for (let i = 2; i < sections.length; i++) {
                const section = sections[i];
                if (section.endsWith('SM')) {
                    decodedMetar.visibility = section;
                } else if (section.endsWith('KT')) {
                    decodedMetar.wind = section;
                }
            }
        }
        for (let i = 0; i < sections.length; i++) {
            if (sections[i] === 'CAVOK') {
                decodedMetar.cloudCover = 'Ceiling And Visibility OK';
                break;
            } else if (sections[i] === 'NOSIG') {
                decodedMetar.cloudCover = 'No significant change';
                break;
            } else if (sections[i] === 'CLR') {
                decodedMetar.cloudCover = 'Clear';
                break;
            } else if (sections[i] === 'FEW') {
                decodedMetar.cloudCover = 'Few';
                break;
            } else if (sections[i] === 'SCT') {
                decodedMetar.cloudCover = 'Scattered';
                break;
            } else if (sections[i] === 'BKN') {
                decodedMetar.cloudCover = 'Broken';
                break;
            } else if (sections[i] === 'OVC') {
                decodedMetar.cloudCover = 'Overcast';
                break;
            }
        }
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].endsWith('/')) {
                const temp = sections[i];
                const dewPoint = sections[i + 1];
                decodedMetar.temperature = `Temperature: ${temp}°C, Dew Point: ${dewPoint}°C`;
                break;
            }
        }
        // Возвращаем объяснение в виде строки
        return JSON.stringify(decodedMetar, null, 2); // Возвращаем JSON-строку для примера
    }
    return decodeInternalMETAR(metarCode);
}

enum CloudTypes {
  CLR = 'Clear',     // ясно
  FEW = 'Few',       // немного
  SCT = 'Scattered', // разорвано
  BKN = 'Broken',    // облачно
  OVC = 'Overcast',  // пасмурно
  NOSIG = 'No significant change', // незначительные облака
  CAVOK = 'Ceiling And Visibility OK', // хороший потолок и видимость
}

decodeBtn?.addEventListener('click', async () => {
    const metarCode = metarCodeInput.value;
    const apiKey = '80889d19955a28e32b25718458ea5f22'; 
    const apiUrl = `http://api.aviationstack.com/v1/airports?icao=${metarCode}&access_key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (metarDecodeOutput && data.data.length > 0) {
            const airportName = data.data[0].airport_name;
            metarDecodeOutput.textContent = `Airport: ${airportName}`;
        } else if (metarDecodeOutput) {
            metarDecodeOutput.textContent = 'Airport is not found';
        }
    } catch (error) {
        console.error('Some error occured while fetching the data:', error);
        if (metarDecodeOutput) {
            metarDecodeOutput.textContent = 'Error';
        }
    }
});