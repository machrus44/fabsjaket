var express = require('express');
var router = express.Router();
var authentication_mdl = require('../middlewares/authentication');
var session_store;
/* GET jaket page. */

router.get('/',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM jaket',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('jaket/list',{title:"jaket",data:rows,session_store:req.session});
		});
     });
});

router.delete('/delete/(:id)',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var jaket = {
			id: req.params.id,
		}
		
		var delete_sql = 'delete from jaket where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, jaket, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/jaket');
				}
				else{
					req.flash('msg_info', 'Delete jaket Success'); 
					res.redirect('/jaket');
				}
			});
		});
	});
});
router.get('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM jaket where id='+req.params.id,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/jaket'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "jaket can't be find!"); 
					res.redirect('/jaket');
				}
				else
				{	
					console.log(rows);
					res.render('jaket/edit',{title:"Edit ",data:rows[0],session_store:req.session});

				}
			}

		});
	});
});
router.put('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.assert('nama', 'Please fill the nama').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_nama = req.sanitize( 'nama' ).escape().trim(); 
		v_jenis = req.sanitize( 'jenis' ).escape().trim();
		v_stok = req.sanitize( 'stok' ).escape().trim();
		v_harga = req.sanitize( 'harga' ).escape().trim();

		var jaket = {
			nama: v_nama,
			jenis: v_jenis,
			stok: v_stok,
			harga: v_harga
		}

		var update_sql = 'update jaket SET ? where id = '+req.params.id;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, jaket, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('jaket/edit', 
					{ 
						nama: req.param('nama'), 
						jenis: req.param('jenis'),
						stok: req.param('stok'),
						harga: req.param('harga'),
					});
				}else{
					req.flash('msg_info', 'Update jaket success'); 
					res.redirect('/jaket');
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "<p>Sory there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.redirect('/jaket');
	}
});

router.post('/add',authentication_mdl.is_login, function(req, res, next) {
	req.assert('nama', 'Please fill the nama').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_nama = req.sanitize( 'nama' ).escape().trim(); 
		v_jenis = req.sanitize( 'jenis' ).escape().trim();
		v_stok = req.sanitize( 'stok' ).escape().trim();
		v_harga = req.sanitize( 'harga' ).escape();

		var jaket = {
			nama: v_nama,
			jenis: v_jenis,
			stok: v_stok,
			harga : v_harga
		}

		var insert_sql = 'INSERT INTO jaket SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, jaket, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('jaket/add', 
					{ 
						nama: req.param('nama'), 
						jenis: req.param('jenis'),
						stok: req.param('stok'),
						harga: req.param('harga'),
						session_store:req.session,
					});
				}else{
					req.flash('msg_info', 'Create jaket success'); 
					res.redirect('/jaket');
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "<p>Sory there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('jaket/add', 
		{ 
			name: req.param('nama'), 
			address: req.param('jenis'),
			session_store:req.session
		});
	}

});

router.get('/add',authentication_mdl.is_login, function(req, res, next) {
	res.render(	'jaket/add', 
	{ 
		title: 'Add New nama',
		nama: '',
		jenis: '',
		stok:'',
		harga:'',
		session_store:req.session
	});
});

module.exports = router;
