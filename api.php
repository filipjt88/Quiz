<?php

header('Content-Type: application/json');
include 'core/db.php';

// Provera koju akciju saljemo
$action = $_GET['action'] ?? '';

if($action === 'get_questions') {
    // Vrati sva pitanja iz baze podataka
    $stmt = $pdo->query("SELECT id, question, option_a, option_b, option_c, option_d FROM questions");
    $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($questions);
    exit;
}

if($action === 'check_answer' && $_SERVER['REQUEST_METHOD'] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if(!isset($data['question_id']) || !isset($data['selected_option'])) {
        echo json_encode(["success" => false, 'message' => 'Nedostaju podaci.']);
        exit;
    }
    $question_id = (int) $data['question_id'];
    $selected_option = strtoupper($data['selected_option']);

    $stmt = $pdo->prepare("SELECT correct_option FROM questions WHERE id = ?");
    $stmt->execute([$question_id]);
    $correct = $stmt->fetch(PDO::FETCH_ASSOC);

    if(!$correct) {
        echo json_encode(['success' => false, 'message' => 'Pitanje nije pronadjeno.']);
        exit;
    }
    $isCorrect = $correct['correct_option'] === $selected_option;
    echo json_encode(['success' => true, 'correct' => $isCorrect]);
    exit;
}

// Ako akcija nije pronadjena
echo json_encode(['success' => false, 'message' => 'Nevazeci zahtev!']);
?>