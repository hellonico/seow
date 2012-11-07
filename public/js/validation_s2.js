// For browsers without `console`
if (typeof console === 'undefined') {
	console = {
		log: function noop() {}
	}
}

// Definitions
!function($) {
	var validators = {}
	window.validators = validators;

	// 必須入力チェック
	var required = function($nodes) {
		var value = _($($nodes)).map(function(node) {
			return $(node).val();
		}).join('');
		return !!value;
	};
	validators.required = required;

	// 必須入力チェック(チェックボックス、ラジオボタン)
	var checked = function($nodes) {
		var valid = _($nodes).any(function(node) {
			return $(node).is(':checked');
		});
		return valid;
	};
	validators.checked = checked;

	// 必須入力チェック(セレクトボックス)
	var selected = function($nodes) {
		var valid = _($nodes).any(function(node) {
			return !!$(node).val();
		});
		return valid;
	};
	validators.selected = selected;
	
	// 先頭スペース禁止チェック
	var startWithSpaceban = function(node) {
		var checker = /^[ 　]+/;
		return !checker.test($(node).val());
	};
	validators.startWithSpaceban = startWithSpaceban;

	// 全角文字を表す正規表現
	var zenkakuRegExp = /(?:[　！”＃＄％＆’（）＊＋，－．／：；＜＝＞？＠［￥］＾＿‘｛｜｝￣])|(?:[、。・゛゜´｀¨ヽヾゝゞ〃仝々〆〇ー―‐＼～“〔〕〈〉《》「」『』【】])|(?:[０-９])|(?:[Ａ-Ｚ])|(?:[ａ-ｚ])|(?:[ぁ-ん])|(?:[ァ-ヶ])|(?:[\u2570-\u25ff])|(?:[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/;
	// 全角指定チェック
	var zenkaku = function(node) {
		var checker = new RegExp('^(?:' + zenkakuRegExp.source + ')*$');
		return checker.test($(node).val());
	};
	validators.zenkaku = zenkaku;

	// 半角文字チェック
	var hankaku = function(node) {
		return !zenkakuRegExp.test($(node).val());
	};
	validators.hankaku = hankaku;

	// 全角記号以外チェック
	var notzenkakukigo = (function() {
		var checker = /[※！”＃＄％＆’（）＝～｜｀［＋＊］＜＞？＿＾￥＠「；：」]/;
		return function(node) {
			return !checker.test($(node).val());
		}
	})();
	validators.notzenkakukigo = notzenkakukigo;

	// 全角カナ指定チェック
	var zenkakukana = (function() {
		var checker = /^[\u30A0-\u30FF０-９ａ-ｚＡ-Ｚ　－]*$/;
		return function(node) {
			return checker.test($(node).val());
		}
	})();
	validators.zenkakukana = zenkakukana;

	// メールアドレス禁止文字列
	var emailbanRegExp = /(?:[!%():;\[\],|\\<>"\u00A5\\'&])/; // '\u00A5' は円マークを表す

	// メールアドレス文字チェック
	var emailban = function(node) {
		return !emailbanRegExp.test($(node).val());
	};
	validators.emailban = emailban;

	// メールアドレスチェック
	var email = (function() {
		var hanKana = /[｡-ﾟ]/;
		var setA = '!%():;\\[\\],|<>"\u00A5\\\\@\\\'& ';
		var setB = setA + '#\\$*/?_`{}~+=^\\.';
		var checker = new RegExp('^[^' +setA + ']+@[^' + setB + ']+(?:\\.[^' + setB + ']+){1,2}$');
		return function(node) {
			var text = $(node).val();
			return hankaku(node)
				&& !hanKana.test(text)
				&& checker.test(text)
		};
	})();
	validators.email = email;

	// 固定電話番号チェック
	var landPhone = function($nodes) {
		if (!startWithZero($nodes)) {
			return false;
		}
		return digit($nodes, 10);
	};
	validators.landPhone = landPhone;

	// 携帯電話番号チェック
	var mobilePhone = function($nodes) {
		if (!startWithZero($nodes)) {
			return false;
		}
		return digit($nodes, 11);
	};
	validators.mobilePhone = mobilePhone;

	// 電話番号チェック
	var phone = function($nodes) {
		if (!startWithZero($nodes)) {
			return false;
		}
		return digit($nodes, 10) || digit($nodes, 11);
	};
	validators.phone = phone;

	// 先頭0チェック
	var startWithZero = function($nodes, allowEmpty) {
		if (allowEmpty && digit($nodes, 0)) {
			return true;
		}
		return /^0/.test($nodes.first().val());
	};
	validators.startWithZero = startWithZero;

	// 半角数字チェック
	var hankakunum = (function() {
		var checker = /^[0-9]*$/;
		return function($nodes) {
			var value = _($nodes).map(function(node) {
				return $(node).val();
			}).join('');
			return checker.test(value);
		}
	})();
	validators.hankakunum = hankakunum;

	// ユーザーIDチェック
	// 業務要件: 英字1文字 + 数字7文字の組み合わせは禁止
	var userid = (function() {
		var chekcer = /^(?:[a-zA-Z][0-9]{7})$/;
		return function(node) {
			return !chekcer.test($(node).val());
		}
	})();
	validators.userid = userid;

	// ユーザID桁数チェック
	// 業務要件: 6桁以上、8桁以下
	var useridLength = function(node) {
		var value = $(node).val();
		return (
				 value.length >= 6
			&& value.length <= 8
		)
	};
	validators.useridLength = useridLength;

	// パスワードチェック
	// 業務用件: 「6 ~ 8 文字の英数字の組み合わせ」
	var password = function(node) {
		var value = $(node).val();
		return (
				 /[0-9]/.test(value)
			&& /[a-zA-Z]/.test(value)
			&& (value.length >= 6)
			&& (value.length <= 8)
		);
	};
	validators.password = password;

	// 半角英数チェック
	var eisu = function(node) {
		var checker = /^[0-9a-zA-Z]*$/;
		return checker.test($(node).val());
	};
	validators.eisu = eisu;

	// 桁数チェック
	var digit = function($nodes, length) {
		var value = _($nodes).map(function(node) {
			return $(node).val();
		}).join('');
		return String(value).length === length;
	};
	validators.digit = digit;

}(jQuery);

// Extensions
!function($) {
	var validators = window.validators;

	// エラーメッセージを表示する
	validators.showError = function showError(el, message) {
		$(el)
			.parents('tr')
			.find('.error-message-area')
			.show()
			.addClass('error-message')
			.html(validators.messageArea(message));
		$(el).parents('td').addClass('error-section');
	};

	// エラーメッセージをクリアする
	validators.clearError = function clearError(el) {
		$(el)
			.parents('tr')
			.find('.error-message-area')
			.removeClass('error-message')
			.empty();
		$(el).parents('td').removeClass('error-section');
	};

	// *message* を表示するための DOM 文字列を返す
	validators.messageArea = function messageArea(message) {
		return [
				'<ul class="error-list">'
			,   '<li>'
			,     message
			,   '</li>'
			, '</ul>'
		].join('');
	};

	// 必須アイコンを入力完了の状態にする
	validators.filledText = function filledText(el) {
		$(el).parents('tr').find('.required-image').css({opacity: 0.5});
	};

	// 必須アイコンを入力未完了の状態にする
	validators.emptyedText = function emptyedText(el) {
		$(el).parents('tr').find('.required-image').css({opacity: 1.0});
	};

	// グループの概念を管理するために、前に focus していたオブジェクトを管理する
	// 'blur' の直後のタイミングで 'exit' イベントを発火させます。
	// 'exit' イベント発火時には、直前に focus されていた DOM 要素を引数で受け取れます。
	// 複数項目でひとつの入力フォームを表現する場合の、focus out などに利用することができます。
	validators.enableContextListener = function() {
		// 現在 focus があたっている DOM 要素
		var context = null;

		$(document).delegate('*', 'focus', function(e) {
			e.stopPropagation();

			$(this).trigger('enter', context);
			context = this;
		});
		$(document).delegate('*', 'blur', function(e) {
			e.stopPropagation();

			var el = this;
			setTimeout(function() {
				if (context === el) {
					context = null;
				}
				$(el).trigger('exit', context);
			});
		});
	};

	// input, select 要素の disable/enable 切替を行う
	var enableinputs = {};
	var enableinputstxt = {};
	window.enableinputs = enableinputs;
	window.enableinputstxt = enableinputstxt;
	enableinputstxt.value = {};

	// ページロード時のテキスト入力disable、enableチェックと入力値一時格納変数の設定
	$('[data-validate-enable-for]').each(function() {
		var enableSelector = $(this).attr('data-validate-enable-for');
		var $enableFor = $(enableSelector);
		$enableFor.removeClass('ad').addClass('da');
		var id = $enableFor.attr('name');
		enableinputstxt.value[id] = '';

		// enableの項目にはクラス追加削除
		if ($(this).is(':checked') && ($(this).is(':checkbox') || $(this).is(':radio'))) {
			$enableFor.removeClass('da').addClass('ad');
		}
		if ($(this).parent().is('select')) {
			var selectedSelector = $(this).parent().find('option:selected').attr('data-validate-enable-for');
			$(selectedSelector).removeClass('da').addClass('ad');
		}
	});

	// disable enable切替時のスタイル切替とdisable時のテキスト入力値の一時保存
	var enableinputstyle = function($node, disabled) {
		$node.attr('disabled', disabled);

		var id = $node.attr('name');
		if (disabled) {
			if (!enableinputstxt.value[id]){
				enableinputstxt.value[id] = $node.val();
				$node.val('');
			}
			$node.removeClass('ad').addClass('da');
		} else {
			$node.removeClass('da').addClass('ad');
			$node.val(enableinputstxt.value[id]);
			enableinputstxt.value[id] = '';
			$node.focus();
		}
	};
	enableinputs.enableinputstyle = enableinputstyle;

	// validate イベントを委譲する
	$(document).delegate('*', 'validate', function() {
		$(this).trigger('blur');
	});

}(jQuery);

// Executions
jQuery(function($) {
	var validators = window.validators;

	// 'exit' イベントを有効にする
	validators.enableContextListener();

	var showError = validators.showError;
	var clearError = validators.clearError;
	var filledText = validators.filledText;
	var emptyedText = validators.emptyedText;
	// *node* のラベルを取得する
	var getLabel = function(node) {
		var label = $(node).data('validateLabel');
		var tr = $(node).parents('tr');
		label = label
			|| tr.find('.fl').first().text()
			|| tr.find('.lv2-2').first().text()
			|| tr.find('strong').first().text();
		return label;
	};
	// 必須アイコンの表示を切り替える
	var toggleRequiredMark = function(filled, el) {
		if (filled) {
			filledText(el);
		} else {
			emptyedText(el);
		}
		return filled;
	}

	console.log('** page loaded **');

	// select の validate を設定 (focus 時には validate を行わない)
	_(['change', 'exit']).each(function(type) {

		// select タグの選択チェック (29 リスト選択)
		$(document).delegate('[data-validate-selected]', type, function(e) {
			var $nodes = $(this).parents('td').find('select');
			var message = $(this).data('validateMessage') || getLabel(this) + 'を選択してください。';

			var valid = true;
			// 追加入力項目の有効/無効設定
			_($(this).find(':not(:selected)')).each(function(node) {
				var $disableTarget = $($(node).attr('data-validate-enable-for'));
				// disable時のスタイル設定と入力テキストを非表示するための入力を一時保存
				if ($disableTarget.size() > 0) {
					enableinputs.enableinputstyle($disableTarget, true);
				}
			});

			var enableSelector = $(this).find(':selected').attr('data-validate-enable-for');
			if (enableSelector) {
				var $enableFor = $(enableSelector);
				if (e.type === 'change') {
					// enable時のスタイル設定と保存して入力値を戻す
					if ($enableFor.size() > 0) {
						enableinputs.enableinputstyle($enableFor, false);
					}
				}

				// select + text のチェック
				valid = !!$enableFor.val();
			}

			// 必須選択チェック
			if (!validators.selected($nodes)) {
				showError(this, message);
				emptyedText(this);
				return true;
			}

			if (valid) {
				clearError(this);
			}
			toggleRequiredMark(valid, this);
		});
	});

	// checkbox, radio の validate を設定
	_(['change', 'focus', 'exit']).each(function(type) {

		// チェックボックスの必須チェック (26 ラジオボタン選択, 33 チェックボックス)
		$(document).delegate('[data-validate-checked]', type, function(e, context) {
			var $nodes = $(this).parents('td').find('input');
			var message;

			// 追加入力項目の有効/無効設定(radio用)
			if ($(this).is(':checked')) {
				var $disableTarget = $($(this).attr('data-validate-disable-for'));

				// disable時のスタイル設定と入力テキストを非表示するための入力を一時保存
				if ($disableTarget.size()) {
					enableinputs.enableinputstyle($disableTarget, true);
				}

				if (e.type === 'change') {
					var $enableTarget = $($(this).attr('data-validate-enable-for'));

					// enable時のスタイル設定と保存して入力値を戻す
					if ($enableTarget.size()) {
						enableinputs.enableinputstyle($enableTarget, false);
						clearError($enableTarget);
					}
				}
			}

			if (_($nodes).contains(context)) { return true; }
			var message = getLabel(this) + 'を選択してください。';

			// 必須選択チェック
			var valid = validators.checked($nodes);
			if (_(['exit', 'change']).contains(e.type) && !valid) {
				showError(this, message);
				emptyedText(this);
				return true;
			}

			// IE の場合、このチェックがないと validation のメッセージが表示されてしまう
			// これは、 event 発火のタイミングの挙動の違いのため
			// 付加入力項目のチェック
			_($nodes).each(function(el) {
				var $el = $(el);
				var $optional = $el.parents('td').find('[data-validate-required-if-checked]');
				if ($optional.length !== 0 && !$optional.attr('disabled') && !validators.required($optional)) {
					valid = false;
				}
			});

			if (valid) {
				clearError(this);
			}
			toggleRequiredMark(valid, this);
		});

		// Club toto 利用時の対象カード選択チェック (25 カード選択)
		$(document).delegate('[data-validate-card-checked]', type, function(e, context) {
			var $nodes = $('[data-validate-card-checked]');

			var $messageArea = $('.error-message-area');

			if (_($nodes).contains(context)) { return true; }

			var showError = function() {
				$messageArea
					.show()
					.addClass('error-message')
					.html(validators.messageArea('カードを選択してください。'));
			};
			var clearError = function() {
				$messageArea
					.removeClass('error-message')
					.empty();
			};

			var checked = validators.checked($nodes);
			if (_(['exit', 'change']).contains(e.type)) {
				if (checked) {
					clearError();
				} else {
					showError();
				}
			}
		});

		// 同意チェックボックス (31 同意チェック)
		$(document).delegate('[data-validate-agree-checked]', type, function(e, context) {
			var $messageArea = $(this).parent().find('.error-message-area')
			var label = '個人情報の取扱いに関する同意条項に同意する'
			if (validators.checked($(this))) {
				$messageArea.empty();
			} else {
				var message = validators.messageArea('同意いただける場合は' + label + 'にチェックを入れてください。');
				$messageArea.html(message);
			}
		});

		// バリデートは行わないが、 他の項目を enable / disable する必要がある要素のイベントを設定
		$(document).delegate('[data-validate-eventable]', type, function(e, context) {
			// 追加入力項目の有効/無効設定(radio用)
			var $enableTarget = $($(this).attr('data-validate-enable-for'));
			var $disableTarget = $($(this).attr('data-validate-disable-for'));
			if ($(this).is(':checked')) {
				$disableTarget.attr('disabled', true);
				$enableTarget.attr('disabled', false);

				// disable enable切替時のスタイル設定
				if (e.type === 'change') {
					// disable時のスタイル設定と入力テキストを非表示するための入力を一時保存
					if ($disableTarget.size() > 0){
						enableinputs.enableinputstyle($disableTarget, true);
					} else {
					// enable時のスタイル設定と保存して入力値を戻す
						enableinputs.enableinputstyle($enableTarget, false);
					}
				}
			}
			// 必須項目ではないので、一度クリアする
			// あとは、enable になった項目にまかせる
			clearError(this);
		});

		// 複数のグループにまたがった radio のチェック (27 ラジオボタン選択＋テキスト, 28 ラジオボタン選択＋半角数字テキスト)
		$(document).delegate('input[type=radio][data-validate-multi-checked]', type, function(e, context) {
			// ここは td をまたいだグループになっている
			var $nodes = $('input[type=radio][data-validate-multi-checked=' + $(this).attr('data-validate-multi-checked') + ']')
			var $topNode = $nodes.first();
			var label = getLabel(this);

			// group のスキップ
			if (_($nodes).contains(context)) { return true; }

			var valid = validators.checked($nodes);
			if (!valid) {
				if (e.type === 'exit') {
					showError($topNode, label + 'を選択してください。');
					$nodes.each(function() {
						$(this).parents('td').addClass('error-section');
					});
				}
				emptyedText($topNode);
				return true;
			}
			clearError($topNode);
			$nodes.each(function() {
				$(this).parents('td').removeClass('error-section');
			});
		});

		// 複数のグループにまたがった checkbox のチェック (33 チェックボックス, 34 チェックボックス＋リスト, 35 チェックボックス＋テキスト)
		$(document).delegate('input[type=checkbox][data-validate-multi-checked]', type, function(e, context) {
			// ここは td をまたいだグループになっている
			var $nodes = $('input[type=checkbox][data-validate-multi-checked=' + $(this).attr('data-validate-multi-checked') + ']')
			var $topNode = $nodes.first();
			var $lastNode = $nodes.last();
			var topLable = getLabel($topNode);
			var lastLable = getLabel($lastNode);

			// 追加入力項目の有効/無効設定(checkbox用)
			var $enableTarget = $($(this).attr('data-validate-enable-for'));
			if ($enableTarget.length >= 0) {
				if ($(this).is(':checked')) {
					if (e.type === 'change') {
						// enable時のスタイル設定と保存して入力値を戻す
						if ($enableTarget.size()) {
							enableinputs.enableinputstyle($enableTarget, false);
						}
					}
				} else {
					// disable時のスタイル設定と入力テキストを非表示するための入力を一時保存
					if ($enableTarget.size()) {
						enableinputs.enableinputstyle($enableTarget, true);
					}
				}
			}

			// group のスキップ
			if (_($nodes).contains(context)) { return true; }

			var valid = validators.checked($nodes);
			if (_(['exit', 'change']).contains(e.type) && !valid) {
				clearError($lastNode); // ひとつもチェックされていない場合、 `$lastNode` にはエラーが表示されていないため
				showError($topNode, topLable + 'と' + lastLable + 'はいずれか1つ以上を選択してください。');
				emptyedText($topNode);
				return true;
			}

			// 付加入力項目のチェック (関連: 27 ラジオボタン選択＋テキスト, 35 チェックボックス＋テキスト)
			_([$topNode, $lastNode]).each(function($el) {
				var $optional = $el.parents('td').find('[data-validate-required-if-checked]');
				if (!$optional.is(':disabled')) {
					if (!$optional.val()) {
						valid = false;
					}
				} else {
					clearError($el);
				}
			});

			if (valid) {
				clearError($topNode);
				clearError($lastNode);
			}
			toggleRequiredMark(valid, $topNode);
		});

		// チェックボックス ON で有効になるテキスト必須のチェック (34 チェックボックス＋リスト)
		$(document).delegate('[data-validate-multi-checked-with-select]', type, function(e, context) {
			var el = this;
			// ここは td をまたいだグループになっている
			var $nodes = $('[data-validate-multi-checked-with-select=' + $(this).attr('data-validate-multi-checked-with-select') + ']')
			var $topNode = $nodes.first();
			var $lastNode = $nodes.last();
			var label = getLabel(this);

			// 追加入力項目の有効/無効設定(checkbox用)
			var $enableTarget = $($(this).attr('data-validate-enable-for'));
			if ($enableTarget.length >= 0) {
				// ここは値の保存を行えない(change イベントの発火が望ましくない)ため、直で切り替え指定を行う
				if (e.type === 'change') {
					if ($(this).is(':checked')) {
						$enableTarget.removeClass('da').addClass('ad');
						$enableTarget.attr('disabled', false).focus();
					}  else {
						$enableTarget.removeClass('ad').addClass('da');
						$enableTarget.attr('disabled', true);
						clearError($enableTarget);
					}
				}
			}

			// group のスキップ
			if (_($nodes).contains(context)) { return true; }

			if (!_(['exit', 'change']).contains(e.type)) {
				return true;
			}

			var anyChecked = validators.checked($nodes);
			if (_(['exit', 'change']).contains(e.type)) {
				if (anyChecked) {
					$nodes.each(function() {
						var checked = validators.checked($(this));
						var selfChanged = (e.type === 'change') && (el === this);
						if (selfChanged || !checked) {
							clearError(this);
							emptyedText(this);
						}
					});
				} else {
					showError($topNode, label + 'を選択してください。');
					$lastNode.parents('td').addClass('error-section');
				}
			}
		});
	});

	// focus が入ってきたイベントであれば `true` を返す
	var isEntered = (function() {
		var ignoreList = _([
				0
			, 9
			, 16
			, 18
		]);
		return function isEntered(e) {
			return e.type === 'keyup' && !ignoreList.contains(e.keyCode);
		};
	})();

	// text の中で文字を空にしたイベントであれば `true` を返す
	// 空の状態の text に focus した状態と区別するために利用している
	var isCleared = (function() {
		var matchingList = _([
				8  // Backspace
			, 17 // Ctrl
			, 46 // Delete
			, 91 // Command
		]);
		return function(e) {
			return e.type === 'keyup' && matchingList.contains(e.keyCode);
		};
	})();

	// *event* イベントのコールバックとして *callback* を *selector* に合致する DOM 要素に設定する
	var bindEvent = function(selector, event, callback) {
		// ie7 での keyup 対策: 本来であれば、この each は不要
		_($(selector)).each(function(node) {
			$(node).bind(event, callback);
		});
	};

	// ペースト禁止 (関連: 22 パスワード, 15 カード暗証番号)
	bindEvent('[data-validate-from-paste]', 'paste', function(e, context) {
		var $el = $(this);
		var before = $el.val();
		$el.data('pasteMessageShowing', true);
		showError(this, getLabel(this) + 'は直接入力してください。');
		setTimeout(function() {
			if ($el.data('pasteMessageShowing')) {
				// 2012.10.31 YMD
				$el.blur();
				// 2012.10.31 YMD
				clearError($el);
			}
			$el.data('pasteMessageShowing', false);
			// 2012.10.31 YMD
			$el.focus();
			// 2012.10.31 YMD
		}, 2000);
		return false;
	});

	// ペースト禁止 (関連: 22 パスワード, 15 カード暗証番号)
	// エラーメッセージ表示中に入力されている内容が変化したかどうかを管理している
	bindEvent('[data-validate-from-paste]', 'keyup', function(e, context) {
		var beforeValue = $(this).data('beforeValue');
		var currentValue = $(this).val();
		if (currentValue && (beforeValue !== currentValue)) {
			$(this).data('pasteMessageShowing', false);
		}
		$(this).data('beforeValue', $(this).val());
	});

	// text の validate を設定
	_(['keyup', 'focus', 'exit']).each(function(type) {

		// グループ化されていない input[type=text] にイベントを設定する

		// 全角文字チェック (03 全角指定)
		bindEvent('[data-validate-zenkaku]', type, function(e, context) {
			var $nodes = $(this).parents('td').find('input');
			var required = $(this).data('validateZenkaku') || !$(this).data('validateOptional');
			var label = getLabel(this);

			// 必須入力チェック
			var valid = true;
			if (required) {
				valid = validators.required($nodes);
			}
			if (e.type === 'exit' && !valid) {
				showError(this, label + 'を入力してください。');
				emptyedText(this);
				return true;
			}

			if (!validators.startWithSpaceban($nodes)) {
				showError(this, label + 'は全角で入力してください。');
				emptyedText(this);
				return true;
			}

			if (!validators.zenkaku($nodes)) {
				showError(this, label + 'は全角で入力してください。');
				emptyedText(this);
				return true;
			}

			if (isEntered(e) || valid) {
				clearError(this);
			}
			toggleRequiredMark(valid, this);
		});

		// 全角カナ文字チェック (04 全角カナ指定)
		bindEvent('[data-validate-zenkakukana]', type, function(e, context) {
			var $nodes = $(this).parents('td').find('input');
			var required = $(this).data('validateZenkakukana') || !$(this).data('validateOptional');
			var label = getLabel(this);

			// 必須入力チェック
			var valid = true;
			if (required) {
				valid = validators.required($nodes);
			}
			if (e.type === 'exit' && !valid) {
				showError(this, label + 'を入力してください。');
				emptyedText(this);
				return true;
			}

			if (!validators.startWithSpaceban($nodes)) {
				showError(this, label + 'は全角で入力してください。');
				emptyedText(this);
				return true;
			}

			// 全角カナ
			if (!validators.zenkakukana($nodes)) {
				showError(this, label + 'は全角カナで入力してください。');
				emptyedText(this);
				return true;
			}

			if (isEntered(e) || valid) {
				clearError(this);
			}
			toggleRequiredMark(valid, this);
		});

		// 数字チェック (09 半角数字)
		bindEvent('[data-validate-integer]', type, function(e, context) {
			var $nodes = $(this).parents('td').find('input');
			var label = getLabel(this);
			var required = $(this).data('validateInteger');

			var valid = true;
			if (required) {
				valid = validators.required($nodes);
			}
			if (e.type === 'exit' && !valid) {
				showError(this, label + 'を入力してください。')
				emptyedText(this);
				return true;
			}
			if (!validators.hankakunum($nodes)) {
				showError(this, label + 'は半角数字で入力してください。');
				emptyedText(this);
				return true;
			}
			var value = $(this).val();
			if (e.type === 'exit' && value) {
				// 先頭 0 (あれば)を取る
				$(this).val(Number(value));
			}

			if (isEntered(e) || valid) {
				clearError(this);
			}
			toggleRequiredMark(valid, this);
		});

		// 免許証番号チェック (10 半角数字桁指定)
		bindEvent('[data-validate-drivers-license]', type, function(e) {
			var $nodes = $(this).parents('td').find('input');
			var $topNode = $nodes.first();
			var label = getLabel(this);

			var validRequired = validators.required($nodes);
			if (!validRequired) {
				if (e.type === 'exit') {
					showError(this, '免許証番号を入力してください。');
					emptyedText(this);
				}
				// 手動で空にした場合はエラーメッセージを非表示にする
				if (e.type === 'keyup') {
					clearError(this);
				}
				$topNode.data('invalidDigit', false);
				return true;
			}
			var valid = true;

			var validNum = validators.hankakunum($nodes);
			if (!validNum) {
				showError(this, label + 'は12桁の半角数字で入力してください。');
				emptyedText(this);
				$topNode.data('invalidDigit', false);
				return true;
			}
			valid = valid && validNum;

			// 桁数チェック
			var validDigit = validators.digit($nodes, 12);
			if (!validDigit) {
				if (!$topNode.data('invalidDigit')) {
					clearError(this);
				}
				if (e.type === 'exit') {
					$topNode.data('invalidDigit', true);
					showError(this, label + 'は12桁の半角数字で入力してください。');
				}
				emptyedText(this);
				return true;
			}

			if (valid) {
				clearError(this);
			}
			$topNode.data('invalidDigit', false);
			toggleRequiredMark(valid, this);
		});

		// カード暗証番号チェック (15 カード暗証番号)
		bindEvent('[data-validate-secret-card-number]', type, function(e) {
			if ($(this).data('pasteMessageShowing')) {
				return true;
			};
			var label = getLabel(this);

			// 必須入力チェック
			var validRequired = validators.required($(this));
			if (!validRequired) {
				if (e.type === 'exit') {
					showError(this, label + 'を入力してください。');
					emptyedText(this);
				}
				if (isCleared(e) || $(this).val()) {
					clearError(this);
				}
				$(this).data('invalidDigit', false);
				return true;
			}
			var valid = true;
			var message = label + 'は4桁の半角数字で入力してください。';

			// 半角数字チェック
			var validNum = validators.hankakunum($(this));
			if (!validNum) {
				showError(this, message);
				emptyedText(this);
				$(this).data('invalidDigit', false);
				// valid = false
				return true;
			}

			// 桁数チェック
			var validDigit = validators.digit($(this), 4);
			if (!validDigit) {
				if (!$(this).data('invalidDigit')) {
					clearError(this);
				}
				if (e.type === 'exit') {
					$(this).data('invalidDigit', true);
					showError(this, message);
				}
				emptyedText(this);
				return true;
			}

			$(this).data('invalidDigit', false);
			clearError(this);
			toggleRequiredMark(valid, this);
		});

		// リスト選択で "その他" 選択時のテキスト必須チェック (関連: 30 リスト選択＋テキスト)
		bindEvent('[data-validate-required-if-selected]', type, function(e) {
			var label = getLabel(this);

			var selectedLabel = $(this).parents('td').find(':selected').text();
			var valid = validators.required($(this));
			if (e.type === 'exit' && !valid) {
				showError(this, label + 'の' + selectedLabel + 'を選択した場合は具体的な内容を入力してください。')
				emptyedText(this);
				return true;
			}

			// ここは `isEntered(e)` は不要
			if (valid) {
				clearError(this);
			}
			toggleRequiredMark(valid, this);
		});

		// ラジオ、チェックボックスで "その他" 選択時のテキスト必須チェック (27 ラジオボタン選択＋テキスト, 34 チェックボックス＋リスト)
		bindEvent('[data-validate-required-if-checked]', type, function(e) {
			var $nodes = $(this).parents('td').find('input');
			var label = getLabel(this);

			var checkedLabel = $(this).data('validateRequiredIfChecked');
			var valid = validators.required($(this));
			if (!valid) {
				if (e.type === 'exit') {
					showError(this, label + 'の' + checkedLabel + 'を選択した場合は具体的な内容を入力してください。')
					emptyedText(this);
				}
				if (isCleared(e) || $(this).val()) {
					clearError(this);
				}
				return true;
			}

			var type = $(this).data('validateType');
			if (type === 'integer') {
				if (validators.hankakunum($(this))) {
					var value = $(this).val();
					if (e.type === 'exit' && value) {
					// 先頭 0 (あれば)を取る
						$(this).val(Number(value));
					}
				} else {
					showError(this, label + 'は半角数字で入力してください。');
					emptyedText(this);
					valid = false;
				}
			}

			// ここは `isEntered(e)` は不要
			if (valid) {
				clearError(this);
			}
			toggleRequiredMark(valid, this);
		});

		// 最小数量チェック (17 移行ポイント, 18 口数)
		bindEvent('[data-validate-point-min-count]', type, function(e, context) {
			var label = $(this).data('validateLabel') || '移行ポイント';
			var $mark = $('#point_icon');
			var $el = $(this);
			var min = $(this).data('validatePointMinCount');

			var valid = true;

			// 必須入力チェック
			var validRequired = validators.required($(this));
			if (!validRequired) {
				valid = false;
				if (e.type === 'exit') {
					showError(this, label + 'を入力してください。');
					emptyedText($mark);
				}
				if (isCleared(e) || $(this).val()) {
					clearError(this);
				}
				return true;
			}
			valid = valid && validRequired;

			var message = label + 'は' + min + '以上の半角数字で入力してください。';

			// 半角数字チェック
			var validNum = validators.hankakunum($(this));
			if (!validNum) {
				showError(this, message);
				emptyedText($mark);
				return true;
			}
			valid = valid && validNum;

			// 定形チェック(`min` 以上)
			var rawValue = $(this).val();
			var value = Number(rawValue);
			var validValue = value >= min;
			if (rawValue && !validValue) {
				showError(this, message);
				emptyedText($mark);
				return true;
			}
			valid = valid && validValue;

			if (e.type === 'exit' && value) {
				$(this).val(value);
			}
			if (valid) {
				clearError(this);
			}
			toggleRequiredMark(valid, $mark);
		});

		// 最小金額チェック (11 ご利用金額)
		bindEvent('[data-validate-min-amount]', type, function(e, context) {
			var label = getLabel(this);

			// 必須入力チェック
			var validRequired = validators.required($(this));
			if (!validRequired) {
				valid = false;
				if (e.type === 'exit') {
					showError(this, label + 'を入力してください。');
					emptyedText(this);
				}
				if (isCleared(e) || $(this).val()) {
					clearError(this);
				}
				return true;
			}

			var message = label + 'は1万円以上1万円単位で入力してください。';

			// 半角数字チェック
			var validNum = validators.hankakunum($(this));
			if (!validNum) {
				showError(this, message);
				emptyedText(this);
				return true;
			}

			var value = $(this).val();
			var valueAsNumber = Number(value);
			// 定形チェック
			if (valueAsNumber < 1) {
				showError(this, message)
				emptyedText(this);
				return true;
			}

			// その他チェック
			var availableAmountText = $(this).parents('table').find('tr:eq(1) td:first').text();;
			// 末尾の "万円" を削除して Number 型へ変換する
			var availableAmount = parseInt(availableAmountText, 10);
			if (availableAmount < valueAsNumber) {
				showError(this, 'ご利用金額はご利用可能限度額以内で入力してください。');
				emptyedText(this);
				return true;
			}

			if (e.type === 'exit' && value) {
				$(this).val(valueAsNumber);
			}

			clearError(this);
			filledText(this);
		});

		// 個数チェック (16 個数入力)
		bindEvent('[data-validate-product-count]', type, function(e, context) {
			var $nodes = $('[data-validate-product-count]');
			var $mark = $(this).parents('table').find('th:eq(3) .fl').first();
			var label = $mark.text();
			var message = label + 'を入力してください。';

			// 必須チェック
			var validRequired = validators.required($(this));
			if (!validRequired) {
				if (e.type === 'exit') {
					showError(this, message);
				}
				if (isCleared(e) || $(this).val()) {
					clearError(this);
				}
				emptyedText($mark);
				return true;
			}

			message = label + 'は1以上の半角数字で入力してください。';

			// 半角数字チェック
			var validNum = validators.hankakunum($(this));
			if (!validNum) {
				showError(this, message);
				emptyedText($mark);
				return true;
			}

			var rawValue = $(this).val();
			var value = Number(rawValue);
			// 定形チェック(1 以上)
			if (value < 1) {
				showError(this, message);
				emptyedText($mark);
				return true;
			}

			// 個数チェックを行う予定であったが、仕様変更により行わないことになった

			if (e.type === 'exit') {
				$(this).val(value);
			}

			clearError(this);
			var allValid = _($nodes).all(validators.required);
			toggleRequiredMark(allValid, $mark);
		});

		// マイレージチェック TODO
		bindEvent('[data-validate-myrage]', type, function(e, context) {
			var label = getLabel(this);
			var valid = true;

			// 必須入力チェック
			var validRequired = validators.required($(this));
			if (!validRequired) {
				if (e.type === 'exit') {
					showError(this, label + 'を入力してください。');
					emptyedText(this);
				}
				// 手動で空にした場合はエラーメッセージを非表示にする
				if (e.type === 'keyup') {
					clearError(this);
				}
				$(this).data('invalidDigit', false);
				return true;
			}
			valid = valid && validRequired;

			var message = label + 'は7桁もしくは9桁の半角数字で入力してください。';

			// 半角数字チェック
			var validNum = validators.hankakunum($(this));
			if (!validNum) {
				showError(this, message);
				emptyedText(this);
				$(this).data('invalidDigit', false);
				return true;
			}
			valid = valid && validNum;

			// 桁数チェック
			var validDigit = validators.digit($(this), 7) || validators.digit($(this), 9);
			if (!validDigit) {
				emptyedText(this);
				if (valid && !$(this).data('invalidDigit')) {
					clearError(this);
				}
				if (e.type === 'exit') {
					$(this).data('invalidDigit', true);
					showError(this, message);
				}
				return true;
			}
			valid = valid && validDigit;

			$(this).data('invalidDigit', false);
			clearError(this);
			toggleRequiredMark(valid, this);
		});

		// グループ項目のリアルタイムチェック

		// 固定電話番号、携帯電話番号、電話番号 (05 固定電話番号, 06 携帯電話番号, 07 電話番号)
		bindEvent('[data-validate-phone]', type, function(e, context) {
			var $nodes = $(this).parents('td').find('input');
			var $topNode = $nodes.first();
			var phoneType = $(this).data('validatePhone');
			var optional = $(this).data('validateOptional');
			var label = getLabel(this);

			// group のスキップ
			if (_($nodes).indexOf(context) >= 0) { return true; }

			var message;
			var validator;
			if (phoneType === 'land') {
				message = '固定電話番号は0から始まり、各項目の合計が10桁となる半角数字で入力してください。';
				validator = validators.landPhone;
			} else if (phoneType === 'mobile') {
				message = '携帯電話番号は0から始まり、各項目の合計が11桁となる半角数字で入力してください。';
				validator = validators.mobilePhone;
			} else if (phoneType === 'some') {
				message = '電話番号は0から始まり、各項目の合計が10桁または11桁となる半角数字で入力してください。';
				validator = validators.phone;
			} else {
				throw 'Unsupported phone type "' + phoneType + '".';
			}

			// focusout の際の桁数チェックに引っかかった場合、
			// そのエラーが解決されるまでエラーメッセージを表示しておく必要がある。
			// 上記の状態を保持しておくため、以下のフラグを利用している
			// `$topNode.data('invalidDigit');`

			var validRequired = validators.required($nodes);
			if (!validRequired) {
				if (e.type === 'exit') {
					if (optional) {
						clearError(this);
						filledText(this);
					} else {
						showError(this, label + 'を入力してください。');
						emptyedText(this);
					}
				}
				// 手動で空にした場合はエラーメッセージを非表示にする
				if (isCleared(e) || $(this).val()) {
					clearError(this);
				}
				$topNode.data('invalidDigit', false);
				return true;
			}
			var valid = true;

			// 先頭文字の 0 チェック
			var validZero = validators.startWithZero($topNode, true);
			if (!validZero) {
				$topNode.data('invalidDigit', false);
				showError(this, message);
				emptyedText(this);
				return true;
			}
			valid = valid && validZero;

			// 半角数字チェック
			var validNum = validators.hankakunum($nodes);
			if (!validNum) {
				$topNode.data('invalidDigit', false);
				showError(this, message);
				emptyedText(this);
				return true;
			}
			valid = valid && validNum;

			// 桁数チェック
			var validDigit = validator($nodes);
			if (!validDigit) {
				if (!$topNode.data('invalidDigit')) {
					clearError(this);
				}
				if (e.type === 'exit') {
					$topNode.data('invalidDigit', true);
					showError(this, message);
				}
				emptyedText(this);
				return true;
			}

			$topNode.data('invalidDigit', false);
			if (valid) {
				clearError(this);
			}
			toggleRequiredMark(valid, this);
		});

		// 固定電話、 携帯電話 いずれか必須 (05 固定電話番号, 06 携帯電話番号)
		bindEvent('[data-validate-multi-phone]', type, function(e, context) {
			var $nodes = $('[data-validate-multi-phone]'); // ここは td をまたいでグループになっている
			var $node = $(this);
			var $topNode = $nodes.first();
			var $lastNode = $nodes.last();
			var computeKey = function(node) {
				return Math.floor(_($nodes).indexOf(node) / 3);
			};
			var groupedNodes = _($nodes).groupBy(computeKey);
			var topLabel = getLabel($topNode);
			var lastLabel = getLabel($lastNode);

			// 電話番号の group 間の移動の場合、必須チェックは行わない
			if (!_($nodes).contains(context)) {
				// 必須入力チェック
				var valid = validators.required($nodes);
				if (e.type === 'exit' && !valid) {
					showError($topNode, topLabel + 'と' + lastLabel + 'はいずれか一方または両方を入力してください。');
					return true;
				}
			}

			// group のスキップ
			if (_(groupedNodes[computeKey(this)]).contains(context)) { return true; }

			// どれぞれのグループ毎に検証していく
			_(groupedNodes).each(function(nodes, key) {
				var $nodes = $(nodes);
				var $headNode = $nodes.first();
				var phoneType = $($headNode).data('validateMultiPhone');
				var optional = $($headNode).data('validateOptional');
				var label = getLabel($headNode);

				var message;
				var validator;
				if (phoneType === 'land') {
					message = '固定電話番号は0から始まり、各項目の合計が10桁となる半角数字で入力してください。';
					validator = validators.landPhone;
				} else if (phoneType === 'mobile') {
					message = '携帯電話番号は0から始まり、各項目の合計が11桁となる半角数字で入力してください。';
					validator = validators.mobilePhone;
				} else if (phoneType === 'some') {
					message = '電話番号は0から始まり、各項目の合計が10桁または11桁となる半角数字で入力してください。';
					validator = validators.phone;
				} else {
					throw 'Unsupported phone type "' + phoneType + '".';
				}

				// focusout の際の桁数チェックに引っかかった場合、
				// そのエラーが解決されるまでエラーメッセージを表示しておく必要がある。
				// 上記の状態を保持しておくため、以下のフラグを利用している
				// `$headNode.data('invalidDigit');`

				var validRequired = validators.required($nodes);
				if (!validRequired) {
					// 手動で空にした場合はエラーメッセージを非表示にする
					if (isCleared(e) || $node.val()) {
						clearError($headNode);
					}
					$headNode.data('invalidDigit', false);
					return true;
				}

				// 先頭文字の 0 チェック
				var validZero = validators.startWithZero($headNode, true);
				if (!validZero) {
					$headNode.data('invalidDigit', false);
					showError($headNode, message);
					valid = false;
					return true;
				}

				// 半角数字チェック
				var validNum = validators.hankakunum($nodes);
				if (!validNum) {
					$headNode.data('invalidDigit', false);
					showError($headNode, message);
					valid = false;
					return true;
				}

				// 桁数チェック
				var validDigit = validator($nodes);
				if (!validDigit) {
					if (!$headNode.data('invalidDigit')) {
						clearError($headNode);
					}
					if (e.type === 'exit') {
						$headNode.data('invalidDigit', true);
						showError($headNode, message);
					}
					valid = false;
					return true;
				}

				$topNode.data('invalidDigit', false);
				clearError($headNode);
			});

			// group 感の移動の際のチラツキ防止
			if (!_($nodes).contains(context)) {
				toggleRequiredMark(valid, $topNode);
			}
		});

		// 郵便番号 (08 郵便番号)
		bindEvent('[data-validate-zip]', type, function(e, context) {
			var $nodes = $(this).parents('td').find('input');
			var $node = $(this);
			var $topNode = $nodes.first();
			var label = getLabel(this);

			// group のスキップ
			if (_($nodes).contains(context)) { return true; }

			// focusout の際の桁数チェックに引っかかった場合、
			// そのエラーが解決されるまでエラーメッセージを表示しておく必要がある。
			// 上記の状態を保持しておくため、以下のフラグを利用している
			// `$topNode.data('invalidDigit');`

			// 必須入力チェック
			var validRequired = validators.required($nodes);
			if (!validRequired) {
				if (e.type === 'exit') {
					showError(this, label + 'を入力してください。');
					emptyedText(this);
				}
				// 手動で空にした場合はエラーメッセージを非表示にする
				if (isCleared(e) || $node.val()) {
					clearError(this);
				}
				$topNode.data('invalidDigit', false);
				return true;
			}
			var valid = true;

			// 半角数字チェック
			var validNum = validators.hankakunum($nodes);
			if (!validNum) {
				$topNode.data('invalidDigit', false);
				showError(this, '郵便番号は3桁+4桁の半角数字で入力してください。');
				emptyedText(this);
				return true;
			}
			valid = valid && validNum;

			// 桁数チェック
			var validDigit = validators.digit($nodes, 7);
			if (!validDigit) {
				valid = false;
				if (!$topNode.data('invalidDigit')) {
					clearError(this);
				}
				if (e.type === 'exit'){
					$topNode.data('invalidDigit', true);
					showError(this, '郵便番号は3桁+4桁の半角数字で入力してください。');
				}
				emptyedText(this);
				return true;
			}
			valid = valid && validDigit;

			$topNode.data('invalidDigit', false);
			if (valid) {
				clearError(this);
			}
			toggleRequiredMark(valid, this);
		});

		// カード番号のチェック (20 カード番号)
		bindEvent('[data-validate-card-format]', type, function(e, context) {
			var $nodes = $('[data-validate-card-format]');
			var el = this;
			var $node = $(el);
			var $topNode = $nodes.first();
			var $lastNode = $nodes.last();
			var $context = $topNode;
			var clearContext = function() {
				$context.data('multipleInvalid', null);
			};
			var label = getLabel($topNode);
			var format = $(el).data('validateCardFormat');

			var groupedNodes = _($nodes).groupBy(function(node) {
				return $(node).data('validateCardFormat');
			});

			// group のスキップ
			if (_(groupedNodes[format]).contains(context)) { return true; }

			var validRequired = validators.required($nodes);
			if (!validRequired) {
				if (e.type === 'exit') {
					clearError($lastNode);
					showError($topNode, label + 'を入力してください。');
					emptyedText($topNode);
				}
				if (isCleared(e) || $node.val()) {
					clearError($topNode);
					clearError($lastNode);
				}
				clearContext();
				$nodes.data('invalidDigit', false);
				return true;
			}
			var valid = true;
			var errorShown = false;

			// ひとつひとつチェックを行う
			_(groupedNodes).each(function(nodes, _key) {
				var $nodes = $(nodes);
				var $top = $nodes.first();
				var label = $top.parent().children('p').text();
				var childValid = true;

				var digits = _($nodes).map(function(node) {
					return Number($(node).attr('maxlength'));
				});
				var totalDigit = _(digits).reduce(function(total, digit) {
					return total + digit;
				}, 0);
				var format = _(digits).map(function(digit) {
					return digit + '桁';
				}).join('+');

				var label = totalDigit + '桁のカード番号';
				var message = label + 'は' + format + 'の半角数字で入力してください。';

				if ($nodes.data('invalidDigit')) {
					childValid = true;
					errorShown = true;
				}

				// 未入力を許容する
				var filled = validators.required($nodes);
				if (!$context.data('multipleInvalid')) {
					if (!filled) {
						$nodes.data('invalidDigit', false);
						clearError($top);
					}
					if (!errorShown) {
						clearError($top);
					}
				}

				// 半角数字チェック
				var validNum = validators.hankakunum($nodes);

				if (!validNum) {
					showError($top, message);
					errorShown = true;
					childValid = false;
				}

				// 桁数チェック
				var validDigit = _($nodes).all(function(node) {
					var length = $(node).attr('maxlength');
					return validators.digit($(node), Number(length));
				});

				var anyFilled = _($nodes).any(validators.required);
				if (anyFilled && childValid) {
					if (!validDigit) {
						if (!errorShown) {
							clearError($node);
						}
						if (e.type === 'exit') {
							$nodes.data('invalidDigit', true);
							showError($top, message);
							errorShown = true;
						}
						childValid = false;
					}
				}

				valid = valid && childValid;
				if (childValid) {
					$nodes.data('invalidDigit', false);
					clearError($top);
				}
			});

			// 16桁、14桁両方の項目に値が入るのは許容されない
			var multple = _(groupedNodes).all(function(nodes, key) {
				return _(nodes).any(validators.required);
			});

			var showMultipleMessage = function(el) {
				if (!$context.data('multipleInvalid')) {
					$context.data('multipleInvalid', el);
				}
				showError($($context.data('multipleInvalid')), 'カード番号は16桁もしくは14桁のどちらか一方のみに入力してください。');
			};

			if (errorShown) {
				// var all = _($nodes).all(validators.required);
				// if (all) {
				//   showMultipleMessage(this);
				// }
				valid = false;
			} else {
				if (multple) {
					showMultipleMessage(this);
					valid = false;
				}
			}

			if (valid) {
				clearContext();
				clearError($topNode);
				clearError($lastNode);
			}
			toggleRequiredMark(valid, $topNode);
		});

		// ユーザー ID チェック (21 ユーザーＩＤ)
		bindEvent('[data-validate-userid]', type, function(e, context) {
			var $nodes = $(this);
			var $topNode = $nodes.first();
			var $context = $('[data-validate-userid=new]'); // $nodes.last();
			var clearContext = function() {
				$context.data('duplicateInvalid', null);
			};
			var clearIfContextError = function() {
				var invalided = $context.data('duplicateInvalid');
				if (invalided) {
					clearError($(invalided));
				}
			};
			var label = getLabel(this);

			// 必須入力チェック
			var validRequired = validators.required($nodes);
			if (!validRequired) {
				clearIfContextError();
				clearContext();
				if (e.type === 'exit') {
					showError($topNode, label + 'を入力してください。');
					emptyedText($topNode);
				}
				if (isCleared(e) || $topNode.val()) {
					clearError($topNode);
				}
				$topNode.data('invalidDigit', false);
				return true;
			}
			var valid = true;

			label = $(this).parents('table').find('tr:first strong').text();
			var validEisu = validators.eisu($nodes);
			if (!validEisu) {
				clearIfContextError();
				clearContext();
				emptyedText(this);
				showError(this, label + 'は6～8文字の半角英数字で入力してください。');
				$topNode.data('invalidDigit', false);
				return true;
			}

			// 英字1桁+数字7桁の組み合わせを禁止する(理由は不明)
			// 要求により、メッセージを他の箇所と統一する必要があったため、
			// チェック内容とメッセージとが一致していない
			var valudUserid = validators.userid($nodes);
			if (!valudUserid) {
				clearIfContextError();
				clearContext();
				emptyedText(this);
				showError(this, label + 'は6～8文字の半角英数字で入力してください。');
				$topNode.data('invalidDigit', false);
				return true;
			}

			// 桁数チェック
			var validLength = validators.useridLength($nodes);
			if (!validLength) {
				clearIfContextError();
				clearContext();
				if (!$topNode.data('invalidDigit')) {
					clearError(this);
				}
				if (e.type === 'exit') {
					$topNode.data('invalidDigit', true);
					showError(this, label + 'は6～8文字の半角英数字で入力してください。');
				}
				emptyedText(this);
				return true;
			}

			var useridType = $(this).data('validateUserid');

			var targetType = _(['current', 'new']).find(function(key) {
				return key !== useridType;
			});

			$topNode.data('invalidDigit', false);

			var value = $(this).val();
			if (value && (value === $('[data-validate-userid=' + targetType + ']').val())) {
				clearIfContextError();
				if (!$context.data('duplicateInvalid')) {
					// 常に "新しいユーザーID" のみにエラーを表示する
					$context.data('duplicateInvalid', $context);
				}

				// 既存メッセージは削除する
				clearError(this);
				showError($context.data('duplicateInvalid'), '現在とは異なるものを入力してください。');
				emptyedText(this);
				return true;
			}

			// "新しいユーザーID" と "新しいパスワード" の不一致確認
			var $newPassword = $('[data-validate-password=new]');
			var $new = $(this).parents('table').find('[data-validate-userid=new]');
			if ($new.val() && $newPassword.val()) {
				if (($new.val() === $newPassword.val())) {
					showError($newPassword, 'ユーザーIDとログインパスワードは異なるものを指定してください。');
					$newPassword.data('combinationInvalid', true);
					emptyedText($newPassword);
					return true;
				} else {
					if ($newPassword.data('combinationInvalid')) {
						clearError($newPassword);
					}
					$newPassword.data('combinationInvalid', false);
					filledText($newPassword);
				}
			}

			clearIfContextError();
			clearContext();
			if (valid) {
				clearError(this);
			}
			toggleRequiredMark(valid, this);
		});

		// パスワードチェック (22 パスワード)
		bindEvent('[data-validate-password]', type, function(e, context) {
			var $nodes = $(this);
			var $topNode = $nodes.first();
			var label = getLabel(this);
			var $group = $(this).parents('table').find('[data-validate-password]');
			var clearCombinationErrors = function() {
				$group.each(function() {
					if ($(this).data('combinationInvalid')) {
						clearError(this);
					}
				});
				$group.data('combinationInvalid', false);
			};

			if ($(this).data('pasteMessageShowing')) {
				clearCombinationErrors();
				return true;
			};

			// 必須入力チェック
			var validRequired = validators.required($nodes);
			if (!validRequired) {
				valid = false;
				clearCombinationErrors();
				if (e.type === 'exit') {
					showError($topNode, label + 'を入力してください。');
					emptyedText($topNode);
				}
				if (isCleared(e) || $topNode.val()) {
					clearError($topNode);
					return true;
				}
				$topNode.data('invalidDigit', false);
			}
			var valid = true;

			label = $(this).parents('table').find('tr:first strong').text();
			var message = label + 'はユーザーIDは6～8文字の半角英数字で入力してください。6～8文字の「半角英数字の組み合わせ」で入力してください。';

			var validEisu = validators.eisu($nodes);
			if (!validEisu) {
				clearCombinationErrors();
				showError(this, message);
				emptyedText(this);
				$topNode.data('invalidDigit', false);
				return true;
			}

			// 桁数チェック
			var validPassword = validators.password($nodes);
			if (!validPassword) {
				valid = false;
				clearCombinationErrors();
				if (!$topNode.data('invalidDigit')) {
					clearError(this);
				}
				if (validators.digit($nodes, 8) || e.type === 'exit') {
					$topNode.data('invalidDigit', true);
					showError(this, message);
					return true;
				}
				emptyedText(this);
			}
			$topNode.data('invalidDigit', false);

			if (!$(this).data('combinationInvalid')) {
				clearError(this);
			}

			// 組み合わせチェック

			var $current = $(this).parents('table').find('[data-validate-password=current]');
			var $new = $(this).parents('table').find('[data-validate-password=new]');
			var $confirmation = $(this).parents('table').find('[data-validate-password=confirmation]');

			// "現在のログインパスワード" と "新しいログインパスワード" の不一致確認
			var passwordType = $topNode.data('validatePassword');
			var _invalid = false;
			if ($new.val()) {
				if ($current.val() === $new.val()) {
					showError($new, '現在とは異なるものを指定してください。');
					emptyedText($new);
					$new.data('combinationInvalid', true);
					_invalid = true;
				} else {
					if ($new.data('combinationInvalid')) {
						clearError($new); // TODO ここは消しすぎと思われる
					}
					$new.data('combinationInvalid', false);
					filledText($new);
				}
			}
			// "新しいログインパスワード" と "新しいログインパスワード(確認用)" の一致確認
			if ($new.val() && $confirmation.val()) {
				if (($new.val() !== $confirmation.val())) {
					showError($confirmation, getLabel($new) + 'と' + getLabel($confirmation) + 'は同じ内容を入力してください。');
					$confirmation.data('combinationInvalid', true);
					emptyedText($confirmation);
					_invalid = true;
				} else {
					if ($confirmation.data('combinationInvalid')) {
						clearError($confirmation);
					}
					$confirmation.data('combinationInvalid', false);
					filledText($confirmation);
				}
			}
			if (_invalid) {
				return true;
			}
			// "新しいユーザーID" と "新しいパスワード" の不一致確認
			var $newUseId = $('[data-validate-userid=new]');
			if ($new.val() && $newUseId.val()) {
				if (($new.val() === $newUseId.val())) {
					showError($new, 'ユーザーIDとログインパスワードは異なるものを指定してください。');
					$new.data('combinationInvalid', true);
					emptyedText($new);
					return true;
				} else {
					if ($new.data('combinationInvalid')) {
						clearError($new);
					}
					$new.data('combinationInvalid', false);
					filledText($new);
				}
			}

			if (valid) {
				clearError(this);
			}
			toggleRequiredMark(valid, this);
		});

		// パーソナルメッセージチェック (23 パーソナルメッセージ)
		bindEvent('[data-validate-personal-message]', type, function(e, context) {
			var $nodes = $(this);
			var label = getLabel(this);

			// 未入力は OK
			if (!$(this).val()) {
				clearError(this);
				return true;
			}

			var validZenkau = validators.zenkaku($nodes);
			if (!validZenkau) {
				showError(this, label + 'は全角25文字以内で入力してください。');
				return true;
			}

			var validNotZenkakuKigo = validators.notzenkakukigo($nodes);
			if (!validNotZenkakuKigo) {
				showError(this, label + 'は記号以外で入力してください。');
				return true;
			}
			clearError(this);
		});

		// メールアドレスチェック (24 メールアドレス)
		bindEvent('[data-validate-user-email]', type, function(e, context) {
			var $node = $(this);
			var label = getLabel(this);
			var $current = $node.parents('table').find('tr:eq(1)');
			var currentEmail = $current.find('td:eq(0) p').first().text();
			var currentLable = $current.find('th').text();

			var valid = true;
			var errorShown = false;

			// 必須入力チェック
			var validRequired = validators.required($node);
			if (!validRequired) {
				if (e.type === 'exit') {
					showError(this, label + 'を入力してください。');
					emptyedText(this);
				}
				if (isCleared(e) || $node.val()) {
					clearError($node);
				}
				$node.data('invalidDigit', false);
				return  true;
			}

			label = 'メールアドレス'; // DOM からは取得できないため、固定値で与える

			var validEmailban = validators.emailban($node);
			if (!validEmailban) {
				showError(this, label + 'は正しく入力してください。');
				emptyedText(this);
				return true;
			}

			var validHankaku = validators.hankaku($node);
			if (!validHankaku) {
				showError(this, label + 'は正しく入力してください。');
				emptyedText(this);
				return true;
			}

			var validEmail = validators.email($node);
			if (!validEmail) {
				valid = false;
				if (!$node.data('invalidDigit')) {
					clearError(this);
				}
				if (e.type === 'exit') {
					errorShown = true;
					$node.data('invalidDigit', true);
					showError(this, label + 'は正しく入力してください。');
					return true;
				}
				emptyedText(this);
			}

			// 以下、組み合わせチェック

			var type = $(this).data('validateUserEmail');
			var value = $(this).val();
			var combinationInvalid;
			var message;
			label = getLabel(this);

			if (type === 'new') {
				if (currentEmail === value) {
					showError(this, '現在とは異なるものを入力してください。');
					emptyedText(this);
					return true;
				}
			}

			// "新しいメールアドレス" と "新しいメールアドレス(確認用)" の検証は常に行う
			var $confirmation = $(this).parents('table').find('[data-validate-user-email=confirmation]');
			var $new = $(this).parents('table').find('[data-validate-user-email=new]');
			if (!errorShown && $new.val() && $confirmation.val()) {
				if ($new.val() !== $confirmation.val()) {
					valid = false;
					showError($confirmation, getLabel($new) + 'と' + getLabel($confirmation) + 'は同じ内容を入力してください。');
					emptyedText($confirmation);
					return true;
				}
			}

			if (isEntered(e) || valid) {
				clearError(this);
			}
			toggleRequiredMark(valid, this);
		});

		// リボ払いのチェック (12 増額返済(1), 13 増額返済(2), 14 増額返済(3))
		bindEvent('[data-validate-ribo]', type, function(e, context) {
			var $nodes = $('[data-validate-ribo]');
			var $node = $(this);
			var label = $(this).parents('.section').find('th:eq(1)').first().text(); // IE だとこの `first` がないとテキストが2個分取得される
			var type = $node.data('validateRibo');
			// エラー状態を保持しておくためのコンテキスト
			var $context = $nodes.first();
			var clearContext = function() {
				$context.data('zeroInvalid', null);
			};
			var clearIfContextError = function() {
				var invalided = $context.data('zeroInvalid');
				if (invalided) {
					clearError($(invalided));
				}
			};
			var pattern;

			var getMessageArea = function(el) {
				return $(el).parents('.section').find('.error-message-area');
			};
			var showError = function($node, message) {
				getMessageArea($node).addClass('error-message').html(message);
				$node.parents('td').addClass('error-section');
			};
			var clearError = function($node) {
				getMessageArea($node).removeClass('error-message').empty();
				$node.parents('td').removeClass('error-section');
			};

			// 初期値を記録する
			var initialValue = $node.data('initialValue');
			if (typeof initialValue === 'undefuned') {
				$node.data('initialValue', $node.val());
			}

			var validRequired = validators.required($node);
			if (!validRequired) {
				clearIfContextError();
				clearContext();
				if (e.type === 'exit') {
					showError($node, validators.messageArea(label + 'を入力してください'));
				}
				if (isCleared(e) || $node.val()) {
					clearError($node);
				}
				return true;
			}
			var valid = true;

			// パリデーションパターンの決定
			if (initialValue) {
				// 初期値がある
				pattern = 3;
			} else if ($nodes.length === 1) {
				// ショッピング / キャッシングのどちらかが表示されている
				pattern = 1;
			} else {
				// ショッピング / キャッシングの両方が表示されている
				pattern = 2;
			}

			var messages = {
					1: label + 'は1以上の半角数字で入力してください。'
				, 2: 'どちらか一方に1以上の半角数字で入力してください。'
				, 3: $(this).parents('.section').find('h2').text().replace('増額返済', '増額希望金額') + 'は0以上の半角数字で入力してください。'
			}

			var validNum = validators.hankakunum($node);
			if (!validNum) {
				clearIfContextError();
				clearContext();
				showError($node, validators.messageArea(messages[pattern]));
				valid = false;
			}

			var value = Number($node.val());

			if (pattern === 1) {
				var validRange = value >= 1;
				if (!validRange) {
					clearIfContextError();
					clearContext();
					showError($node, validators.messageArea(messages[pattern]));
					valid = false;
				}
			}
			var availableAmountText = $node.parents('table').find('tr:eq(2) td:first p').text();
			// 末尾に '万円' がついているので、無視して `Number` にする
			var availableAmount = parseInt(availableAmountText, 10);
			if (value > availableAmount) {
				label = $(this).parents('.section').find('h2').text();
				// XXX
				label = label.replace('増額返済', '増額希望金額');
				clearIfContextError();
				clearContext();
				showError($node, validators.messageArea(label + 'は増額可能金額の範囲内で入力してください。'));
				valid = false;
			}

			if (pattern === 2) {
				// 組み合わせチェック
				var allZero = _($nodes).all(function(node) {
					var value = $(node).val();
					return value && validNum && (Number(value) === 0);
				});
				if (valid && allZero) {
					if (!$context.data('zeroInvalid')) {
						showError($(this), validators.messageArea('どちらか一方に1以上の半角数字で入力してください。'));
						$context.data('zeroInvalid', this);
					}
					valid = false;
				}
			}

			if (valid && e.type === 'exit' && value) {
				$(this).val(value);
			}

			if (valid) {
				clearIfContextError();
				clearContext();
				clearError($node);
			}
		});
	});

	_(['keyup', 'exit', 'focus']).each(function(type) {

		// ある項目の入力によって、必須/任意が変更になる項目のための設定
		bindEvent('[data-validate-required-if-any-inputted]', type, function(e, context) {
			var key = $(this).data('validateRequiredIfAnyInputted');
			var $group = $('[data-validate-required-if-any-inputted=' + key + ']');

			var targets = _(['Zenkaku', 'Zenkakukana', 'Integer']);

			var changeRequired = function(required) {
				_($group).each(function(node) {
					targets.each(function(target) {
						var exist = typeof($(node).data('validate' + target)) !== 'undefined';
						if (exist) {
							$(node).data('validate' + target, required);
						}
					});
				});
			};

			if (validators.required($group)) {
				changeRequired(true);
			} else {
				changeRequired(false);
			}
		});
	});

	_(['change', 'focus', 'keyup', 'exit']).each(function(type) {

		// 年収のある主婦(夫) 用のチェック
		bindEvent('[data-validate-housewife]', type, function(e, context) {
			var $job = $('[data-validate-housewife=job]');
			var $income = $('[data-validate-housewife=annual-income]');
			var $required = $('[data-validate-housewife=required]');

			var label = getLabel($income);

			var requiredMessage = '年収のある主婦(夫)の方は「勤務先」「勤務先(フリガナ)」「勤務先電話番号」をすべて入力してください。';

			// 税込年収の必須入力チェック
			var valid = validators.required($income);
			if (!valid) {
				if (_($income).contains(this)) {
					if (e.type === 'exit') {
						showError($income, label + 'を入力してください。');
						emptyedText($income);
					}
					if (isEntered(e) && e.type === 'keyup') {
						clearError($income);
					}
				}
				return true;
			}

			// 税込年収の半角チェック
			var validNum = validators.hankakunum($income);
			if (!validNum) {
				showError($income, label + 'は半角数字で入力してください。');
				return true;
			}

			// 税込年収の範囲チェック
			var value = $income.val();
			if ($job.attr('checked')) {
				if (Number(value) > 103) {
					showError($income, '104万円以上の年収がある方は「有職者」を選択してください。');
					return true;
				}
			}

			// 「職業 = 主婦」 & 「税込年収 = 0 ~ 103」の時に必須となる項目のチェック
			if ($job.is(':checked')) {
				if (value > 0) {
					$required.data('validateOptional', false);
					var valid = _($required).all(function(node) {
						return validators.required($(node));
					});
					if (!valid) {
						showError($income, requiredMessage);
						return true;
					}
				} else {
					$required.data('validateOptional', true);
				}
			} else {
				$required.data('validateOptional', false);
			}

			if ($(this).is('[data-validate-housewife=annual-income]')) {
				if (e.type === 'exit' && value) {
					// 先頭 0 (あれば)を取る
					$income.val(Number(value));
				}
			}

			clearError($income);
		});
	});

	// パーソナルメッセージの文字数カウントアップデート
	(function() {
		var template = _.template('残り <%= remainingCount %>文字');
		var $area = $('#remaining-personal-message-count');
		var $personalMessageArea = $('#personal-messaage');

		if ($personalMessageArea.length <= 0) { return true; }

		var max = Number($personalMessageArea.attr('maxlength'));

		var updateArea = function() {
			var count = $personalMessageArea.val().length;
			var remainingCount = _([max - count, 0]).max();
			var text = template({remainingCount: remainingCount});

			$area.text(text);
		};
		_(['keyup', 'change', 'blur']).each(function(type) {
			bindEvent($personalMessageArea, type, updateArea);
		});
		updateArea();
	})();
});
