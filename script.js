// انتظر حتى يتم تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', () => {
    // احصل على زر التبديل وجسم الصفحة
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // عند الضغط على الزر
    themeToggle.addEventListener('click', () => {
        // قم بإضافة أو إزالة كلاس 'light-mode' من جسم الصفحة
        body.classList.toggle('light-mode');
    });
});

// الكود الخاص بحساب التوزيع الإلكتروني
document.getElementById('calculate-btn').addEventListener('click', function() {
    const atomicNumberInput = document.getElementById('atomic-number');
    const atomicNumber = parseInt(atomicNumberInput.value);

    if (isNaN(atomicNumber) || atomicNumber < 1 || atomicNumber > 118) {
        alert("الرجاء إدخال عدد ذري صحيح بين 1 و 118.");
        return;
    }

    document.getElementById('results-container').style.display = 'block';

    const orbitalOrder = [
        { name: '1s', capacity: 2, boxes: 1 }, { name: '2s', capacity: 2, boxes: 1 },
        { name: '2p', capacity: 6, boxes: 3 }, { name: '3s', capacity: 2, boxes: 1 },
        { name: '3p', capacity: 6, boxes: 3 }, { name: '4s', capacity: 2, boxes: 1 },
        { name: '3d', capacity: 10, boxes: 5 }, { name: '4p', capacity: 6, boxes: 3 },
        { name: '5s', capacity: 2, boxes: 1 }, { name: '4d', capacity: 10, boxes: 5 },
        { name: '5p', capacity: 6, boxes: 3 }, { name: '6s', capacity: 2, boxes: 1 },
        { name: '4f', capacity: 14, boxes: 7 }, { name: '5d', capacity: 10, boxes: 5 },
        { name: '6p', capacity: 6, boxes: 3 }, { name: '7s', capacity: 2, boxes: 1 },
        { name: '5f', capacity: 14, boxes: 7 }, { name: '6d', capacity: 10, boxes: 5 },
        { name: '7p', capacity: 6, boxes: 3 },
    ];
    
    let remainingElectrons = atomicNumber;
    let standardConfig = '';
    let orbitalDiagramHTML = '';
    let configurationData = [];

    for (const orbital of orbitalOrder) {
        if (remainingElectrons <= 0) break;

        const electronsInOrbital = Math.min(remainingElectrons, orbital.capacity);
        
        standardConfig += `${orbital.name}<sup>${electronsInOrbital}</sup> `;
        orbitalDiagramHTML += generateOrbitalBoxes(orbital.name, orbital.boxes, electronsInOrbital);
        
        const energyLevel = parseInt(orbital.name.charAt(0));
        const type = orbital.name.charAt(1);
        configurationData.push({ level: energyLevel, type: type, electrons: electronsInOrbital, name: orbital.name });
        
        remainingElectrons -= electronsInOrbital;
    }

    // --- حساب الدورة، التكافؤ، والمجموعة ---
    let period = 0;
    let valenceElectrons = 0;
    let group = '';

    if (configurationData.length > 0) {
        // 1. حساب الدورة (أعلى مستوى طاقة)
        const maxLevel = Math.max(...configurationData.map(item => item.level));
        period = maxLevel;

        // 2. حساب إلكترونات التكافؤ
        valenceElectrons = configurationData
            .filter(item => item.level === maxLevel)
            .reduce((sum, item) => sum + item.electrons, 0);

        // 3. حساب المجموعة
        const lastFilled = configurationData[configurationData.length - 1];
        
        if (lastFilled.type === 's') {
            group = valenceElectrons.toString();
        } else if (lastFilled.type === 'p') {
            group = (valenceElectrons + 10).toString();
        } else if (lastFilled.type === 'd') {
            // للعناصر الانتقالية، المجموعة = إلكترونات آخر s + آخر d
            const last_s = configurationData.find(o => o.level === maxLevel && o.type === 's');
            const s_electrons = last_s ? last_s.electrons : 0;
            group = (s_electrons + lastFilled.electrons).toString();
        } else if (lastFilled.type === 'f') {
            // عناصر f-block
            group = lastFilled.level === 4 ? 'لانثانيدات' : 'أكتينيدات';
        }
    }
    // --- نهاية الحسابات ---

    // عرض النتائج
    document.getElementById('period-number').textContent = period;
    document.getElementById('group-number').textContent = group;
    document.getElementById('valence-electrons').textContent = valenceElectrons;
    document.getElementById('standard-config').innerHTML = standardConfig.trim();
    document.getElementById('orbital-diagram').innerHTML = orbitalDiagramHTML;
});

function generateOrbitalBoxes(name, numBoxes, electrons) {
    let html = `<div class="subshell"><span class="orbital-label">${name}</span>`;
    let boxesContent = Array(numBoxes).fill('');

    // Hund's Rule
    for (let i = 0; i < numBoxes && electrons > 0; i++) {
        if (electrons > 0) {
            boxesContent[i] += '↑';
            electrons--;
        }
    }

    // Pauli Exclusion Principle
    for (let i = 0; i < numBoxes && electrons > 0; i++) {
        if (electrons > 0) {
            boxesContent[i] += '↓';
            electrons--;
        }
    }
    
    for (const content of boxesContent) {
        html += `<div class="orbital">${content}</div>`;
    }

    html += `</div>`;
    return html;
}
