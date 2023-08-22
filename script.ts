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
    //my future code
    return 'future result'
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