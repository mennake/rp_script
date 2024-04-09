current.contact_type = 'self-service';

var message = "Your issue has been logged. Thank you.";
gs.addInfoMessage(message); 

var allVars = [];
for (var v in producer) {
    if (v.startsWith("IO")) { //only variables

        var question = new GlideRecord('item_option_new');
        question.addQuery('sys_id', v.substring(2)); // Querying by sys_id to determine question text
		question.orderBy('order');
        question.query();
        while (question.next()) {
			gs.log("order: " + question.order);
			if (question.type != 32) { // Skip questions with type 32
				if (question.type == 8 || question.type == 21 || question.type == 5) { //reference or list collector or select box
					if (question.type == 5) { // Select Box
						// Get the value of the Select Box directly from the producer object
						var selectBoxValue = producer[v].getDisplayValue();
						allVars += question.question_text + ": " + selectBoxValue + "\n";
					} else {
							var gr = new GlideRecord(question.reference + '');
							gr.addQuery('sys_id', 'IN', producer[v] + '');
							gr.query();
							while (gr.next()) {
								allVars += question.question_text + ": " + gr.getDisplayValue() + "\n";
							}
					}
				} else {
					allVars += question.question_text + ": " + producer[v] + "\n"; // Set key:value pair to variable
				}
			}
        }
    }
}
current.description = allVars; // Set Work Notes on new record

producer.redirect = 'incident_list.do?sysparm_query=caller_idDYNAMIC90d1921e5f510100a9ad2572f2b477fe^ORopened_byDYNAMIC90d1921e5f510100a9ad2572f2b477fe^stateNOT IN6,7,8';
