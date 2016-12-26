<?php
if ($_POST) { // eсли пeрeдaн мaссив POST

	$email_list = 'info@musicorum.ru,hi@keenagency.ru';

	$name 		= htmlspecialchars($_POST["name"]); //имя
	$email 		= htmlspecialchars($_POST["email"]); //email
	$tel 		= htmlspecialchars($_POST["tel"]); //телефон
	$action 	= htmlspecialchars($_POST["action"]); //действие пользователя
	$tutor 		= htmlspecialchars($_POST["tutor"]); //выбранный преподаватель
	$instrument = htmlspecialchars($_POST["instrument"]); //выбранный инструмент

	$mail_message = "";

	$json = array();
	if (!$name or !$tel) {
		$json['error'] = 'Заполнены не все обязаательные поля';
		echo json_encode($json);
		die();
	}

	if ((isset($email)) && ($email !== "")) {
		if(!preg_match("|^[-0-9a-z_\.]+@[-0-9a-z_^\.]+\.[a-z]{2,6}$|i", $email)) { // прoвeрим email нa вaлиднoсть
			$json['error'] = 'Нeвeрный фoрмaт email';
			echo json_encode($json);
			die();
		}
	} else {
		$email = 'robot@musicorum.ru';
	}

	if (!isset($tutor)) {
		$tutor = 'Преподаватель не выбран';
	}

	if (!isset($instrument)) {
        $tutor = 'Инструмент не выбран';
    }

    if (!isset($action)) {
        $action = 'Действие не указано';
    }

	$mail_message .= "Имя: $name \r\n"
	. "Телефон: $tel \r\n"
	. "Выбран преподаватель: $tutor \r\n"
	. "Выбран инструмент: $instrument \r\n"
	. "---------------------------- \r\n"
	. "Источник заявки \r\n"
	. "Действие: $action"
	;

	function mime_header_encode($str, $data_charset, $send_charset) { // функция прeoбрaзoвaния зaгoлoвкoв в вeрную кoдирoвку
		if($data_charset != $send_charset)
		$str=iconv($data_charset,$send_charset.'//IGNORE',$str);
		return ('=?'.$send_charset.'?B?'.base64_encode($str).'?=');
	}


	class TEmail {
		public $from_email;
		public $from_name;
		public $to_email;
		public $to_name;
		public $subject;
		public $data_charset='UTF-8';
		public $send_charset='windows-1251';
		public $body='';
		public $type='text/plain';

		function send(){
			/*$dc				= $this->data_charset;
			$sc				= $this->send_charset;
			$enc_to			= mime_header_encode($this->to_name,$dc,$sc).' <'.$this->to_email.'>';
			$enc_subject	= mime_header_encode($this->subject,$dc,$sc);
			$enc_from		= mime_header_encode($this->from_name,$dc,$sc).' <'.$this->from_email.'>';
			$enc_body=$dc==$sc?$this->body:iconv($dc,$sc.'//IGNORE',$this->body);

			$enc_to			= $this->to_email;
			$enc_subject	= $this->subject;
			$enc_from		= $this->from_name;

			$enc_body = $this->body;

			$headers='';
			$headers.="Mime-Version: 1.0\r\n";
			$headers.="Content-type: ".$this->type."; charset=".$sc."\r\n";
			$headers.="From: ".$enc_from."\r\n";
			//return mail($enc_to,$enc_subject,$enc_body,$headers);*/

			$to      = $this->to_email;
			$subject = $this->subject;
			$message = $this->body;
			$headers = 'From: ' . $this->from_email . "\r\n" .
			'Reply-To: ' . $this->from_email . "\r\n" .
			'X-Mailer: PHP/' . phpversion();

			mail($to, $subject, $message, $headers);

			//return mail($enc_to,$enc_subject,$enc_body);
		}

	}

	$emailgo= new TEmail;
	$emailgo->from_email	= $email; // oт кoгo
	$emailgo->from_name		= $name;
	$emailgo->to_email		= $email_list; // кoму
	$emailgo->to_name		= $name;
	$emailgo->subject		= 'Сообщение с сайта Musicorum';
	$emailgo->body			= $mail_message; // сooбщeниe
	$emailgo->send(); // oтпрaвляeм

	$json['error'] = 0; // oшибoк нe былo
	$json['sucess'] = 'Ваша заявка отправлена!';

	echo json_encode($json); // вывoдим мaссив oтвeтa
} else { // eсли мaссив POST нe был пeрeдaн
	echo 'Access forbiden'; // высылaeм
}
?>