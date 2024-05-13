document.addEventListener('deviceready', onDeviceReady, false);

let hasAlerted20 = false; // Corrected flag name
let hasAlerted100 = false;

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    window.addEventListener("batterystatus", onBatteryStatus, false);
}

function onBatteryStatus(status) {
    console.log("Battery Level: " + status.level + "%");
    console.log("Is Plugged In: " + (status.isPlugged ? "Yes" : "No"));

    let level = status.level;
    document.getElementById('batteryLevel').textContent = level + '%';
    document.getElementById('isPlugged').textContent = status.isPlugged ? "Yes" : "No";
    
    
    

    if (level <= 20 && !hasAlerted20) {
        showAlert("Battery level is low (20% or below). Please charge your device.");
        hasAlerted20 = true;
    } else if (level > 20 && level < 100) {
        hasAlerted20 = false; // Reset the 20% alert flag if battery level goes above 20%
    }

    if (level === 100 && !hasAlerted100) {
        showAlert("Battery is fully charged (100%).");
        hasAlerted100 = true;
    } else if (level < 100) {
        hasAlerted100 = false; // Reset the 100% alert flag if battery level drops below 100%
    }
}

function showAlert(message) {
    alert(message);
}

initBattery()

function initBattery(){
    const batteryLiquid = document.querySelector('.battery__liquid'),
          batteryStatus = document.querySelector('.battery__status'),
          batteryPercentage = document.querySelector('.battery__percentage')
    
    navigator.getBattery().then((batt) =>{
        updateBattery = () =>{
            /* 1. We update the number level of the battery */
            let level = Math.floor(batt.level * 100)
            batteryPercentage.innerHTML = level +'%'
            if(level >=51 && level <=58){
                batteryPercentage.innerHTML = level + 1 +'%'
            }
            else if(level >=60 || level <=50){
                batteryPercentage.innerHTML = level  +'%'
            }


            /* 2. We update the background level of the battery */
            batteryLiquid.style.height = `${parseInt(batt.level * 100)}%`

            /* 3. We validate full battery, low battery and if it is charging or not */
            if(level == 100){ /* We validate if the battery is full */
                batteryStatus.innerHTML = `Full battery <i class="ri-battery-2-fill green-color"></i>`
                batteryLiquid.style.height = '103%' /* To hide the ellipse */
            }
            else if(level <= 20 &! batt.charging){ /* We validate if the battery is low */
                batteryStatus.innerHTML = `Low battery <i class="ri-plug-line animated-red"></i>`
            }
          
            else{ /* If it's not loading, don't show anything. */
                batteryStatus.innerHTML = ''
            }
            batteryPercentage.style.color = level <= 20 ? 'red' : level <= 73 ? 'orange' : 'green';
            /* 4. We change the colors of the battery and remove the other colors */
            if(level <=20){
                batteryLiquid.classList.add('gradient-color-red')
                batteryLiquid.classList.remove('gradient-color-orange','gradient-color-yellow','gradient-color-green')
            
            }
            else if(level <= 40){
                batteryLiquid.classList.add('gradient-color-orange')
                batteryLiquid.classList.remove('gradient-color-red','gradient-color-yellow','gradient-color-green')
           
            }
            else if(level <= 80){
                batteryLiquid.classList.add('gradient-color-yellow')
                batteryLiquid.classList.remove('gradient-color-red','gradient-color-orange','gradient-color-green')
             
            }
            else{
                batteryLiquid.classList.add('gradient-color-green')
                batteryLiquid.classList.remove('gradient-color-red','gradient-color-orange','gradient-color-yellow')
             
            }
        }
        updateBattery()

        /* 5. Battery status events */
        batt.addEventListener('chargingchange', () => {updateBattery()})
        batt.addEventListener('levelchange', () => {updateBattery()})
    })
}