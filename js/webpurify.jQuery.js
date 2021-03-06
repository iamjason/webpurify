/**

WebPurify (http://www.webpurify.com) Profanity Filter Utility

Copyright (c) 2010 Jason Garrett - http://jasongarrett.me

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

(function($) {

	var BASE_URL = 'http://api1.webpurify.com/services/rest/?api_key=%API_KEY%&method=%METHOD%&format=json&lang=%LANG%&callback=%CALLBACK%&text=%TEXT%';
	var lang = 'en';
	var api_key = '';
	var methods = {
					'check' 			: 'webpurify.live.check',
					'checkcount' 		: 'webpurify.live.checkcount',
					'replace'			: 'webpurify.live.replace',
					'returnProfanity'	: 'webpurify.live.return'
			  	  };		

   $.webpurify = {
   
		/** init() - Initializes the API for subsequent function calls.
					 !!! REQUIRED BEFORE THE FIRST FUNCTION CALL !!!
					 
			@param key - The API key provided by WebPurify.com
			
			$.webpurify.init('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

		*/
   		init : function( key ){
   			api_key = key;
   			BASE_URL = BASE_URL.replace( /%API_KEY%/g, api_key );
   			BASE_URL = BASE_URL.replace( /%LANG%/g, lang );
   		},
   		
   		/** check() - A profanity checking method. 
   		
   			@param str - The text to be filtered
   			@param callback - passed a boolean if profane words found

	   		$.webpurify.check( 'here is some test', function(isProfane){
				alert( '$.webpurify.check() - ' + isProfane );
			});
			 
   		*/
   		check :function ( str, callback ) {   			
  			var url = createURL( methods.check, str );
  			callService( url, function(data){
  				var found = data.rsp.found > 0;  				
  				callback( found );
  			}); 			
   		},
   		
   		
   		/** checkcount() - A profanity checking method. 
   		
   			@param str - The text to be filtered
   			@param callback - passed the number of profane words found

	   		$.webpurify.checkcount( 'the text to check here', function(num){
					alert( '$.webpurify.checkcount() - ' + num + ' profane word(s).' );
			});
			 
   		*/
   		checkcount :function ( str, callback ) {
  			var url = createURL( methods.checkcount, str );
  			callService( url, function(data){
  				var found = data.rsp.found;  				
  				callback( found );
  			});
   		},

   		/** replace() - A profanity search and replace method. 
   		
   			@param str - The text to be filtered
   			@param replaceCharacter - The character that replaces profane words.
   			@param callback - passed the submitted text with profane 
   				   words replaced with symbol provided. 
   				   
  	   		$.webpurify.replace( 'here is the text to filter', '*', function(text){
				alert( '$.webpurify.replace() - ' + text );
			});
			 
   		*/   		
   		replace :function ( str, replaceCharacter, callback ) {
   			var url = createURL( methods.replace, str );
  			url += '&replacesymbol=' + escape( replaceCharacter );
  			callService( url, function(data){
  				var found = data.rsp.text;  				
  				callback( found );
  			});
   		},
   		
   		/** returnProfanity() - A profanity checking method. 
   		
   			@param str - The text to be filtered
   			@param callback - passed an array of profane words found

	   		$.webpurify.returnProfanity( 'the text to check', function(words){
				$.each(words, function(index, value) { 
				  alert(index + ': ' + value); 
				});
			});			 
   		*/
   		returnProfanity :function ( str, callback ) {
   			var url = createURL( methods.returnProfanity, str );
  			callService( url, function(data){
  				var found = data.rsp.expletive;  				
  				callback( found );
  			});
   		}
   }

	///////////////////////////////////////////////////////////////////
	// UTILITY FUNCTIONS
	///////////////////////////////////////////////////////////////////
	function createURL( theMethod, theText ){
	
		var url = replaceToken( '%METHOD%', theMethod, BASE_URL );
		url = replaceToken( '%TEXT%', theText, url );
		url = replaceToken( '%CALLBACK%', '?', url );
		return url;
	}
	function replaceToken( token, toReplace, theText ){	
		var r = new RegExp( token, 'g' );
		return theText.replace( r, toReplace );
	}	
	function callService( theURL, onSuccess ){
		$.ajax({
			type: 'GET',
			url: theURL,
			dataType: 'jsonp',
			success: onSuccess,
			data: {},
			async: false,
			error: function(e, s, m){}
		});	
	}
   
})(jQuery);