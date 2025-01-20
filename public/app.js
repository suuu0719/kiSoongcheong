const API_KEY = 'f4f213e679e7020236641230719df947';
const LAT = 37.495848;
const LON = 126.957814;
const current_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&lang=kr`;
const forecast_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&lang=kr`;

const temp = document.getElementById('temp');
const min = document.getElementById('min_temp');
const max = document.getElementById('max_temp');
const condition = document.getElementById('condition');
const msg = document.getElementById('message');
const weatherIcon = document.getElementById("icon");
const loadingMessage = document.getElementById('loading-message');
const randomImage = document.getElementById('random');

const images = [
    "clear.png",
    "cloudy.png",
    "drizzle.png",
    "rain.png",
    "snow.png",
    "thunderstorm.png",
];

async function getWeather() {   
    let temperature = null; 

    try {
        // 현재 날씨 가져오기
        const currentResponse = await fetch(current_URL);
        const currentData = await currentResponse.json();
        temperature = currentData.main.temp.toFixed(1); // 현재 온도
        const weatherData = translateWeather(currentData.weather[0].id); // 상태
        const message = getTemperatureMessage(temperature);

        if (temp) temp.innerHTML = `현재 숭실대의 날씨는 <span class="highlight">${temperature}℃</span>,`;
        if (condition) condition.innerHTML = `<span class="highlight">${weatherData.description}</span>입니다.`;
        if (msg) msg.innerHTML = `${message}`;
        if (weatherIcon) {
            weatherIcon.src = `./img/${weatherData.icon}`;
            weatherIcon.alt = weatherData.description; 
        }
        if (loadingMessage) loadingMessage.style.display = "none";

        // 일기 예보 가져오기
        const forecastResponse = await fetch(forecast_URL);
        const forecastData = await forecastResponse.json();
        const today = new Date();
        const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
        const formattedToday = localDate.toISOString().split("T")[0];
        const todayData = forecastData.list.filter(item => item.dt_txt.startsWith(formattedToday));

        if (todayData.length === 0) {
            console.warn("오늘의 일기 예보 데이터가 없습니다.");
            return;
        }

        let minTemp = Number.POSITIVE_INFINITY;
        let maxTemp = Number.NEGATIVE_INFINITY;

        todayData.forEach(item => {
            const tempMin = parseFloat(item.main.temp_min);
            const tempMax = parseFloat(item.main.temp_max);

            console.log(tempMin, tempMax, temperature); 

            if (!isNaN(tempMin) && tempMin < minTemp) minTemp = tempMin;
            if (!isNaN(tempMax) && tempMax > maxTemp) maxTemp = tempMax;
        });

        console.log(`최저 기온: ${minTemp}, 최고 기온: ${maxTemp}, 현재 기온: ${temperature}`);

        // 최저/최고 기온 계산 후 현재 기온과 비교하여 업데이트
        if (temperature < minTemp) {
            minTemp = parseFloat(temperature);
            console.log(`현재 기온이 최저 기온보다 낮음: 최저 기온 업데이트 -> ${minTemp}`);
        }
        if (temperature > maxTemp) {
            maxTemp = parseFloat(temperature);
            console.log(`현재 기온이 최고 기온보다 높음: 최고 기온 업데이트 -> ${maxTemp}`);
        }

        console.log(`최종 최저 기온: ${minTemp}, 최종 최고 기온: ${maxTemp}, 현재 기온: ${temperature}`);

        // 최저/최고 기온 표시
        if (isFinite(minTemp) && isFinite(maxTemp)) {
            if (min) min.innerHTML = `오늘의 최저온도는 <span class="highlight">${minTemp.toFixed(1)}°C</span>, `;
            if (max) max.innerHTML = `최고 온도는 <span class="highlight">${maxTemp.toFixed(1)}℃</span>입니다.`;
        } else {
            console.error("최저/최고 기온 계산 오류:", { minTemp, maxTemp });
        }
    } catch (error) {
        console.error("날씨 데이터를 가져오는 중 오류 발생:", error);
    }
}

window.onload = function() {    
    if (randomImage) {
        setInterval(changeRandomImage, 1000); // 이미지가 존재하면 setInterval 실행
    } 
    if (loadingMessage) {
        loadingMessage.style.display = "block";
    }
    getWeather();
  };

function translateWeather(condition) {
    if (condition >= 200 && condition < 300) return { description: "천둥", icon: "thunderstorm.png" };
    if (condition >= 300 && condition < 500) return { description: "이슬비", icon: "drizzle.png" };
    if (condition >= 500 && condition < 600) return { description: "비", icon: "rain.png" };
    if (condition >= 600 && condition < 700) return { description: "눈", icon: "snow.png" };
    if (condition >= 700 && condition < 800) return { description: "흐림", icon: "cloudy.png" };
    if (condition === 800) return { description: "맑음", icon: "clear.png" };
    if (condition > 800) return { description: "구름 많음", icon: "partly_cloudy.png" };
    return { description: "알 수 없음", icon: "unknown.png" };
}

function getTemperatureMessage(temperature) {
    if (temperature <= -10) {
        return "극한의 추위!🥶 두꺼운 패딩은 필수! 히트텍, 내복, 목도리, 장갑, 귀마개까지 꼭 무장하세요. 🧤🧣";
    } else if (temperature > -10 && temperature <= 0) {
        return "매우 추워요!❄️ 따뜻한 코트와 니트🧶, 목도리🧣를 준비하세요. 핫팩도 추천!🔥";
    } else if (temperature > 0 && temperature <= 5) {
        return "찬 바람이 느껴지고 추워요!🍂 따뜻한 외투🧥를 챙기세요!";
    } else if (temperature > 5 && temperature <= 10) {
        return "쌀쌀한 날씨네요.🍃 자켓을 챙기세요. 과잠 입기 딱 좋은 날씨!🧥 ";
    } else if (temperature > 10 && temperature <= 15) {
        return "선선하고 포근한 날씨네요. 🌤️🍁 가디건🧶이나 얇은 자켓 입기 좋아요.";
    } else if (temperature > 15 && temperature <= 20) {
        return "봄,가을 같은 포근한 날씨! 🌸🍃 긴팔 티셔츠나 가벼운 셔츠👔에 청바지 추천해요.👖";
    } else if (temperature > 20 && temperature <= 25) {
        return "따뜻한 날씨입니다!☀️🌴 반팔 티셔츠👕와 같은 가벼운 옷차림을 추천해요.";
    } else if (temperature > 25 && temperature <= 30) {
        return "무더운 날씨예요! 🌞💦 반팔, 반바지같은 시원한 옷차림 추천!👚🩳";
    } else {
        return "폭염주의보! 🔥🌞☀️ 더위 조심하세요! 시원한 옷차림에 모자🧢와 선글라스🕶 어때요? 수분 섭취는 필수!💧🥤";
    }
}

function showClothingRecommendation() {
    const currentTemperature = temp.innerText.match(/(\d+(\.\d+)?)/)[0]; // 현재 온도를 추출
    const clothingMessage = getClothingRecommendation(currentTemperature); // 기온에 맞는 옷차림 추천 메시지
    
    // 추천 메시지 표시
    const clothingRecommendation = document.getElementById('recommendation');
    clothingRecommendation.innerHTML = ` 
        <h2>오늘의 옷차림 추천</h2>
        <p id='recommendation-message'>${clothingMessage}</p>
        <button onclick="closeRecommendation()">닫기</button>
    `;

    // 추천 화면 보이기
    clothingRecommendation.style.display = "block";

}

function getClothingRecommendation(temperature) {
    const recommendations = {
        "-10°C 이하": [
            "🥶 얼굴까지 덮을 수 있는 목도리를 준비하세요. 바람이 얼음같이 차가워요!",
            "🧊 패딩 안에 히트텍 2겹은 기본! 장갑, 목도리, 귀마개는 필수입니다!",
            "❄️ 북극 수준의 추위! 롱패딩에 두꺼운 니트와 내복을 입고, 목도리와 장갑으로 체온을 보호하세요.",
            "🔥 히트텍 착용은 필수! 핫팩을 옷 안쪽에 숨겨보세요!"
        ],
        "-10°C ~ 0°C": [
            "🧣 롱패딩이나 두꺼운 패딩이 없으면 추위를 견디기 어려워요!",
            "🧤 목도리를 꼭 챙기세요. 내복은 선택이 아닌 필수입니다!",
            "🔥 숏패딩이나 두꺼운 코트를 입고, 안에 니트와 셔츠를 레이어드하세요.",
        ],
        "0°C ~ 5°C": [
            "🍂 패딩이나 두꺼운 코트를 입으세요!",
            "🧥 코트나 패딩에 기모 후드로 캐주얼하면서도 따뜻하게!",
            "🧶 따뜻한 코트에 니트 입고 포근한 분위기를 내보세요!",
        ],
        "5°C ~ 10°C": [
            "🍁 자켓이나 가디건, 니트를 입기에 좋은 날씨입니다.",
            "🧥 과잠과 긴팔 이너로 편안하면서도 따뜻한 캠퍼스룩 완성!",
            "🌬️ 바람 타고 오는 추위막기 재킷 + 후드 콤비네이션!"
        ],
        "10°C ~ 15°C": [
            "🌤️ 레이어드룩의 천국! 얇은 옷 여러 겹 입어 스타일링하세요.",
            "👔 긴팔셔츠에 얇은 자켓으로 세련된 룩을 연출하세요!",
            "🌈 가디건 + 셔츠 조합으로 캠퍼스 패션 완성!"
        ],
        "15°C ~ 20°C": [
            "👖 얇은 자켓과 긴팔 티셔츠에 청바지는 황금 조합!",
            "🌸 셔츠에 스니커즈로 심플하고 깔끔한 룩을 연출해봐요!",
            "🍃 후드티나 맨투맨을 단독으로 입고 함께 캠퍼스 산책 어때요?",
        ],
        "20°C ~ 25°C": [
            "👚 반팔 + 얇은 가디건으로 심플하고 깔끔한 룩을 연출해 보세요!",
            "🌞 반팔 블라우스와 반바지로 선선한 날씨를 즐기고, 스니커즈로 마무리!",
            "🍦 아이스크림 먹기 좋은 날씨에 반팔 티 + 얇은 긴팔 셔츠 + 반바지 어때요?"
        ],
        "25°C ~ 30°C": [
            "🩳 반팔 티셔츠와 린넨 반바지로 여름 느낌을 만끽하세요! 샌들도 잘 어울려요.",
            "👙 민소매와 얇은 면 반바지로 시원함과 스타일을 동시에! 스포츠 샌들로 마무리하세요.",
            "🌴 얇은 셔츠와 쿨링 소재 반바지로 더위를 피하세요. 가벼운 운동화도 추천!"
        ],
        "30°C 이상": [
            "🥵 초경량 반팔 티셔츠와 통기성 좋은 반바지로 폭염을 견디세요. 슬리퍼가 딱이에요!",
            "🧊 메시 소재의 상의와 쿨링 쇼츠로 시원한 여름 패션을 완성해 보세요. 크록스를 곁들여도 좋아요!",
            "🌞 반팔 블라우스와 통풍이 잘 되는 반바지로 더위를 버텨봐요!"
        ]
    };

    for (const [tempRange, clothingOptions] of Object.entries(recommendations)) {
        const [min, max] = tempRange.match(/(-?\d+)/g).map(Number);
        if (temperature > min && temperature <= max) {
            return clothingOptions[Math.floor(Math.random() * clothingOptions.length)];
        }
    }
    return "오늘 날씨에 딱 맞는 옷차림을 고민 중이에요! 🤔";
}


function closeRecommendation() {
    // 추천 화면 숨기기
    const Recommendation = document.getElementById('recommendation');
    Recommendation.style.display = "none";
}

function showActivityRecommendation() {
    const currentTemperature = temp.innerText.match(/(\d+(\.\d+)?)/)[0]; // 현재 온도를 추출
    const currentWeatherCondition = condition.innerText.trim().replace("입니다.",""); // 현재 날씨 상태
    const activityMessage = getActivityRecommendation(currentTemperature, currentWeatherCondition);
    
    // 추천 메시지 표시
    const activityRecommendation = document.getElementById('recommendation');
    activityRecommendation.innerHTML = `
        <h2>오늘의 활동 추천</h2>
        <p id="recommendation-message">${activityMessage}</p>
        <button onclick="closeRecommendation()">닫기</button>
    `;

    // 추천 화면 보이기
    activityRecommendation.style.display = "block";
    
}

function getActivityRecommendation(temperature, weatherCondition) {
    
    // 기온에 따른 추천 활동
    const activityRecommendations = {
        "-10°C 이하": [
            "🧊 추운 날엔 따뜻한 실내에서 보드게임 한 판 즐겨보세요!",
            "🎮 게임하면서 따뜻한 실내 데이트를 즐기는 건 어때요?",
            "📚 따뜻한 커피 한 잔과 함께 책을 읽으며 여유를 만끽해 보세요."
        ],
        "-10°C ~ 0°C": [
            "🍲 따뜻한 국물 요리로 몸과 마음을 녹이세요!",
            "🧸 실내에서 요가나 스트레칭으로 건강도 챙기고 기분도 업 시켜보세요.",
            "🎬 좋아하는 영화나 드라마를 몰아보며 포근한 하루를 보내보세요.",
            "🎵 음악을 들으며 방 정리를 해보는 것도 힐링이 될 거예요."
        ],
        "0°C ~ 10°C": [
            "☕️ 따뜻한 카페를 찾아다니며 맛있는 디저트를 즐겨보세요.",
            "🎨 공방에서 나만의 작품을 만들어보는 건 어떨까요? 캔들 만들기 추천!",
            "🍳 집에서 쿠킹 클래스를 열어 요리 실력을 뽐내보세요!",
            "🏛️ 근처 박물관이나 전시회를 방문해 문화생활을 즐겨보세요."
        ],
        "10°C ~ 20°C": [
            "🚲 상쾌한 바람을 맞으며 자전거로 캠퍼스를 달려보세요.",
            "🌳 돗자리를 들고 공원에서 피크닉을 즐기며 여유로운 하루를 보내보세요.",
            "🏀 친구들과 실외 농구 한 판 하며 에너지를 발산해보세요!",
            "🎸 야외 버스킹 공연을 감상하며 특별한 시간을 만들어보세요."
        ],
        "20°C ~ 25°C": [
            "🚶‍♂️ 산책하기 좋은 날씨! 연인이나 친구와 함께 데이트 코스를 걸어보세요.",
            "📷 카메라를 들고 주변 풍경을 찍으며 인생 사진을 남겨보세요.",
            "🎵 야외 음악 페스티벌이나 플리마켓에 방문해 활기찬 하루를 보내보세요.",
            "🎢 놀이공원에서 하루를 보내보세요! 롤러코스터와 관람차는 필수 코스!"
        ],
        "25°C 이상": [
            "🏊‍♀️ 워터파크에서 물놀이를 즐기며 더위를 날려버리세요!",
            "❄️ 빙수 맛집을 찾아 달콤하고 시원한 시간을 가져보세요.",
            "🍹 시원한 음료가 있는 카페에서 더위를 피하며 여유를 즐겨보세요"
        ]
    };

    // 날씨에 따른 추천 활동
    const weatherSpecificActivities = {
        "비": [
            "🌂 실내에서 보드게임을 즐겨보세요.",
            "☔ 빗소리를 들으며 창가에서 차 한 잔의 여유를 즐겨보세요.",
            "📖 도서관에서 책을 읽으며 고요한 시간을 가져보세요.",
            "🍿 영화관에서 최신 영화를 감상하며 비 오는 하루를 특별하게 보내보세요.",
            "🎨 미술관이나 박물관을 방문해 새로운 경험을 쌓아보세요."
        ],
        "눈": [
            "🤩 눈 오는 풍경 속을 걸으며 겨울의 매력을 느껴보세요.",
            "⛄ 눈사람 만들기 대회를 열어보세요!",
            "🧊 따뜻한 음료를 준비하고 실내에서 영화를 보며 하루를 보내보세요."
        ],
        "맑음": [
            "🏞️ 근처 공원에서 산책하며 상쾌한 공기를 마셔보세요.",
            "🌅 일출이나 일몰을 감상하며 하루를 특별하게 만들어보세요.",
            "🍃 야외 테라스에서 브런치를 즐기며 기분 좋은 하루를 시작해보세요.",
        ],
        "구름 많음": [
            "📚 카페에서 커피를 마시며 독서를 즐겨보세요.",
            "🛍️ 가까운 쇼핑몰을 구경하며 쇼핑을 즐겨보세요.",
            "🍵 따뜻한 차와 간단한 다과를 준비해 조용한 하루를 즐겨보세요."
        ]      
    };

    let matchedRecommendations = [];


    for (const [tempRange, activities] of Object.entries(activityRecommendations)) {
        const [min, max] = tempRange.match(/(-?\d+)/g).map(Number);
        if (temperature > min && temperature <= max) {
            matchedRecommendations.push(...activities);
        }
    }
    
    if (weatherSpecificActivities[weatherCondition]) {
        matchedRecommendations.push(...weatherSpecificActivities[weatherCondition]);
    }

    return matchedRecommendations.length > 0 
        ? matchedRecommendations[Math.floor(Math.random() * matchedRecommendations.length)]
        : "오늘 뭐하지? 고민 중! 🤔";
}

function changeRandomImage() {
    const randomIndex = Math.floor(Math.random() * images.length);
    const selectedImage = `img/${images[randomIndex]}`; // img/ 디렉토리 경로와 결합
    randomImage.src = selectedImage; // 이미지 src 업데이트
}

function validateForm() {
    const name = document.getElementById('name').value.trim();
    const birthdate = document.getElementById('birthdate').value.trim();
    const userId = document.getElementById('userId').value.trim();
    const password = document.getElementById('password').value.trim();
    const department = document.getElementById('department').value;
    const gender = document.querySelector('input[name="radio"]:checked');
    
    // 이름 유효성 검사
    if (name.length < 2 || name.length > 10) {
        alert('이름은 2자 이상 10자 이하로 입력해주세요.');
        return false;
    }

    // 생년월일 유효성 검사
    if (!birthdate) {
        alert('생년월일을 입력해주세요.');
        return false;
    }

    // 아이디 유효성 검사 (영문, 숫자만 허용, 4~12자)
    const userIdRegex = /^[a-zA-Z0-9]{4,12}$/;
    if (!userIdRegex.test(userId)) {
        alert('아이디는 4-12자의 영문 또는 숫자만 가능합니다.');
        return false;
    }

    // 비밀번호 유효성 검사 (최소 6자 이상)
    if (password.length < 6) {
        alert('비밀번호는 최소 6자 이상이어야 합니다.');
        return false;
    }

    // 학과 선택 유효성 검사
    if (department === '학과를 선택하세요') {
        alert('학과를 선택해주세요.');
        return false;
    }

    // 성별 유효성 검사
    if (!gender) {
        alert('성별을 선택해주세요.');
        return false;
    }

    // 모든 유효성 검사를 통과한 경우
    alert(`${name}님, 회원가입에 성공했습니다!`);
    return true;
}