var startBoard;
var helpBoard;
var help;

$('#help').change(function () {
	help = $('#help').is(":checked");
	if (!help) $('input').css('color', 'black');
	else $("#checkBoard").trigger("click");
});

$("#newBoard").click(function(){
	var dif = $("#dif").val();
	$.ajax(
		{
			url: "https://sugoku2.herokuapp.com/board?difficulty=" + dif, 
			success: function(result)
			{
				$('input').prop('disabled', false).val('')
				$('input').css('color', 'black');
				$("#getHint").prop('disabled', false)
				startBoard = result['board'];
				helpBoard = startBoard.map(v => [...v])
				sudokuSolver(helpBoard);
				for (let i = 0; i < 9; i++) {
					for (let j = 0; j < 9; j++) {
						if (startBoard[i][j] != 0) {
							$("#cell-" + ((i * 9) + j)).prop('disabled', true).val(startBoard[i][j]);
						}
					}
				}
			}
		}
	);
});

$("#checkBoard").click(function(){
	var userBoard = getUserBoard();
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			if (startBoard[i][j] == 0 && userBoard[i][j] != '')
				$("#cell-" + ((i * 9) + j)).css('color', (helpBoard[i][j] != userBoard[i][j]) ? 'red' : 'green');
			else
				$("#cell-" + ((i * 9) + j)).css('color', 'black');
		}
	}
});



$("#getHint").click(function(){
	if (!compareBoards()) {
		var userBoard = getUserBoard();
		let ran = Math.floor(Math.random() * 81);
		while ($("#cell-" + ran).val()) {
			ran = Math.floor(Math.random() * 81);
		} 
		var i = Math.floor(ran / 9);
		var j = ran - (i * 9);
		$("#cell-" + ran).prop('disabled', true).val(helpBoard[i][j]);
	} else {
		$("#getHint").prop('disabled', true)
	}
})

$("#clearBoard").click(function(){
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			if (startBoard[i][j] != 0)
				$("#cell-" + ((i * 9) + j)).prop('disabled', true).val(startBoard[i][j]);
			else
				$("#cell-" + ((i * 9) + j)).prop('disabled', false).val('');
		}
	}
});

$("#solveBoard").click(function(){
	$('input').css('color', 'black');
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			$("#cell-" + ((i * 9) + j)).prop('disabled', true).val(helpBoard[i][j]);
		}
	}
});

// let board = formatBoard(temp);

// function formatBoard(board) {
// 	let data = board.map(v => v.join(' '))
// 	row1 = '-------------------------\n| ' + data[0].slice(0, 6) + '| ' + data[0].slice(6, 12) + '| ' + data[0].slice(12) + ' |\n| ';
// 	row2 = data[1].slice(0, 6) + '| ' + data[1].slice(6, 12) + '| ' + data[1].slice(12) + ' |\n| ';
// 	row3 = data[2].slice(0, 6) + '| ' + data[2].slice(6, 12) + '| ' + data[2].slice(12) + ' |\n';
// 	row4 = '-------------------------\n| ' + data[3].slice(0, 6) + '| ' + data[3].slice(6, 12) + '| ' + data[3].slice(12) + ' |\n| ';
// 	row5 = data[4].slice(0, 6) + '| ' + data[4].slice(6, 12) + '| ' + data[4].slice(12) + ' |\n| ';
// 	row6 = data[5].slice(0, 6) + '| ' + data[5].slice(6, 12) + '| ' + data[5].slice(12) + ' |\n';
// 	row7 = '-------------------------\n| ' + data[6].slice(0, 6) + '| ' + data[6].slice(6, 12) + '| ' + data[6].slice(12) + ' |\n| ';
// 	row8 = data[7].slice(0, 6) + '| ' + data[7].slice(6, 12) + '| ' + data[7].slice(12) + ' |\n| ';
// 	row9 = data[8].slice(0, 6) + '| ' + data[8].slice(6, 12) + '| ' + data[8].slice(12) + ' |\n-------------------------';
// 	return row1  + row2 + row3 + row4 + row5 + row6 + row7 + row8 + row9;
// }

function getUserBoard() {
	let retBoard = [];
	var c;
	for (let i = 0; i < 9; i++) {
		let temp = [];
		for (let j = 0; j < 9; j++) {
			c = parseInt($("#cell-" + ((i * 9) + j)).val());
			temp.push(c ? c : 0)
		}
		retBoard.push(temp)
	}
	return retBoard
}

function checkInput(num) {
	var c = parseInt($("#cell-" + num).val());
	var i = Math.floor(num / 9);
	var j = num - (i * 9);
	$("#cell-" + num).css('color', (!help) ? 'black' : (helpBoard[i][j] != c && help) ? 'red' : 'green');
	return (helpBoard[i][j] != c) ? false : true
}

function compareBoards() {
	var userBoard = getUserBoard();
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			if (userBoard[i][j] != helpBoard[i][j])
				return false;
		}
	}
	return true;
}

function isValid(board, row, col, k) {
	for (let i = 0; i < 9; i++) {
		const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
		const n = 3 * Math.floor(col / 3) + i % 3;
		if (board[row][i] == k || board[i][col] == k || board[m][n] == k)
			return false;
	}
	return true;
}

function sudokuSolver(data) {
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			if (data[i][j] == 0) {
				for (let k = 1; k <= 9; k++) {
					if (isValid(data, i, j, k)) {
						data[i][j] = k;
						if (sudokuSolver(data))
							return true;
						else
							data[i][j] = 0;
					}
				}
				return false;
			}
		}
	}
	return true;
}
