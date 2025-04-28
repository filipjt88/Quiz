const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result');
let questions = [];
let currentQuestionIndex = 0;

// Ucitavanje pitanja sa servera
async function loadQuestions() {
    try {
        const response = await fetch('api.php?action=get_questions');
        questions = await response.json();
        showQuestion();
    } catch(error) {
        quizContainer.innerHTML = '<div class="alert alert-danger">Greska u  ucitavanju pitanja.</div>';
    }
}

// Prikaz pitanja
function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        quizContainer.innerHTML = '<h3>Kviz je završen!</h3>';
        return;
    }

    const q = questions[currentQuestionIndex];

    quizContainer.innerHTML = `
        <h5>${q.question}</h5>
        <div class="list-group mt-5">
            <button class="list-group-item list-group-item-action" onclick="submitAnswer(${q.id}, 'a')">${q.option_a}</button>
            <button class="list-group-item list-group-item-action" onclick="submitAnswer(${q.id}, 'b')">${q.option_b}</button>
            <button class="list-group-item list-group-item-action" onclick="submitAnswer(${q.id}, 'c')">${q.option_c}</button>
            <button class="list-group-item list-group-item-action" onclick="submitAnswer(${q.id}, 'd')">${q.option_d}</button>
        </div>
    `;
}



// Kada kliknes na odgovor

async function submitAnswer(questionId, selectedOption) {
    try {
        const response = await fetch('api.php?action=check_answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questionId: questionId,
                selectedOption: selectedOption
            })
        });

        const data = await response.json();
        if(data.success) {
            if(data.correct) {
                resultContainer.innerHTML = '<div class="alert alert-success">Ovo je tacan odogovor!</div>';
            } else {
                resultContainer.innerHTML = '<div class="alert alert-danger">Ovo je netacan odogovor!</div>';
            }
            // Sledi onda sledece pitanje
            currentQuestionIndex++;
            setTimeout(() => {
                resultContainer.innerHTML = '';
                showQuestion();
            }, 2000);
        } else {
            alert(data.message);
        }
    } catch(error) {
        alert("Greska prilikom slanja odgovora.")
    }
}

loadQuestions();