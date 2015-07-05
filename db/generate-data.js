var exec = require('child_process').exec,
	fs = require('fs'),
	lunches = [];

function generate(type){
	for(var i=0; i<100; i++){
		lunches.push({
			name: type + '-' + i,
			type: type,
			ingredients: [
				{
					name: 'quinoa',
					amount: '140g'
				},
				{
					name: "olive oil",
					amount: "1 tsp"
				},
				{
					name: 'vegetable stock',
					amount: '400ml'
				}
			],
			method: [
				'step 1',
				'step 2',
				'step 3',
				'step 4',
				'step 5',
			]
		});
	}
}

generate('lunch');
generate('dinner');

fs.writeFile('./db/meals.json', JSON.stringify(lunches), {encoding: 'utf-8'}, function(){
	exec('mongoimport --db meal-planner --collection meals --drop db/meals.json --jsonArray', 
		function(err, stdout, stderr){
			if(err){
				console.log(err);
			}
			console.log(stdout);
		}
	);
});