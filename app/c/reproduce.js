'use strict';

/*
 *
 * @param opts { max_part_length, mutation_factor }
 */
app.c.Reproduce = function (p1, p2, name, opts) {
	var gps = [ p1.getGenotype(), p2.getGenotype() ];
	
	//number of genes from one of parents
	var part_length,
	//index of currently copied genotype (0 or 1)
		genotype_index;

	//helper
	var gene = new app.c.Gene();
	
	var randomNextPart = function () {
		part_length = Math.floor(Math.random() % opts.max_part_length) + 1;
		genotype_index = Math.round(Math.random());
	};

	var crossoverGenotype = function (gps) {
		if (gps[0] instanceof app.m.Gene) {
			var g = gps[genotype_index].clone();

			if (Math.random() < opts.mutation_factor) {
				gene.setM(g).random();
			}

			if (--part_length <= 0)
				randomNextPart();
			
			return g;
		}
		else if (Object.isArray(gps[0])) {
			var arr = [];
			for (var i = 0, l = gps[0].length; i < l; ++i) {
				arr[i] = crossoverGenotype([ gps[0][i], gps[1][i] ]);
			}
			return arr;
		}
		else {
			var obj = {};
			for (var i in gps[0]) {
				if (gps[0].hasOwnProperty(i)) {
					obj[i] = crossoverGenotype([ gps[0][i], gps[1][i] ]);
				}
			}
			return obj;
		}
	};

	randomNextPart();
	return new app.m.Creature(name, crossoverGenotype(gps));
};
