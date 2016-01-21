all:

populate:
	 nodejs ./loaddb.js csg_cah cards drop
	 nodejs ./loaddb.js csg_cah cards data/white_cards.json
	 nodejs ./loaddb.js csg_cah cards data/black_cards.json
