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

	// �K�{���̓`�F�b�N
	var required = function($nodes) {
		var value = _($($nodes)).map(function(node) {
			return $(node).val();
		}).join('');
		return !!value;
	};
	validators.required = required;

	// �K�{���̓`�F�b�N(�`�F�b�N�{�b�N�X�A���W�I�{�^��)
	var checked = function($nodes) {
		var valid = _($nodes).any(function(node) {
			return $(node).is(':checked');
		});
		return valid;
	};
	validators.checked = checked;

	// �K�{���̓`�F�b�N(�Z���N�g�{�b�N�X)
	var selected = function($nodes) {
		var valid = _($nodes).any(function(node) {
			return !!$(node).val();
		});
		return valid;
	};
	validators.selected = selected;
	
	// �擪�X�y�[�X�֎~�`�F�b�N
	var startWithSpaceban = function(node) {
		var checker = /^[ �@]+/;
		return !checker.test($(node).val());
	};
	validators.startWithSpaceban = startWithSpaceban;

	// �S�p������\�����K�\��
	var zenkakuRegExp = /(?:[�@�I�h���������f�i�j���{�C�|�D�^�F�G�������H���m���n�O�Q�e�o�b�p�P])|(?:[�A�B�E�J�K�L�M�N�R�S�T�U�V�W�X�Y�Z�[�\�]�_�`�g�k�l�q�r�s�t�u�v�w�x�y�z])|(?:[�O-�X])|(?:[�`-�y])|(?:[��-��])|(?:[��-��])|(?:[�@-��])|(?:[\u2570-\u25ff])|(?:[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/;
	// �S�p�w��`�F�b�N
	var zenkaku = function(node) {
		var checker = new RegExp('^(?:' + zenkakuRegExp.source + ')*$');
		return checker.test($(node).val());
	};
	validators.zenkaku = zenkaku;

	// ���p�����`�F�b�N
	var hankaku = function(node) {
		return !zenkakuRegExp.test($(node).val());
	};
	validators.hankaku = hankaku;

	// �S�p�L���ȊO�`�F�b�N
	var notzenkakukigo = (function() {
		var checker = /[���I�h���������f�i�j���`�b�M�m�{���n�����H�Q�O�����u�G�F�v]/;
		return function(node) {
			return !checker.test($(node).val());
		}
	})();
	validators.notzenkakukigo = notzenkakukigo;

	// �S�p�J�i�w��`�F�b�N
	var zenkakukana = (function() {
		var checker = /^[\u30A0-\u30FF�O-�X��-���`-�y�@�|]*$/;
		return function(node) {
			return checker.test($(node).val());
		}
	})();
	validators.zenkakukana = zenkakukana;

	// ���[���A�h���X�֎~������
	var emailbanRegExp = /(?:[!%():;\[\],|\\<>"\u00A5\\'&])/; // '\u00A5' �͉~�}�[�N��\��

	// ���[���A�h���X�����`�F�b�N
	var emailban = function(node) {
		return !emailbanRegExp.test($(node).val());
	};
	validators.emailban = emailban;

	// ���[���A�h���X�`�F�b�N
	var email = (function() {
		var hanKana = /[�-�]/;
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

	// �Œ�d�b�ԍ��`�F�b�N
	var landPhone = function($nodes) {
		if (!startWithZero($nodes)) {
			return false;
		}
		return digit($nodes, 10);
	};
	validators.landPhone = landPhone;

	// �g�ѓd�b�ԍ��`�F�b�N
	var mobilePhone = function($nodes) {
		if (!startWithZero($nodes)) {
			return false;
		}
		return digit($nodes, 11);
	};
	validators.mobilePhone = mobilePhone;

	// �d�b�ԍ��`�F�b�N
	var phone = function($nodes) {
		if (!startWithZero($nodes)) {
			return false;
		}
		return digit($nodes, 10) || digit($nodes, 11);
	};
	validators.phone = phone;

	// �擪0�`�F�b�N
	var startWithZero = function($nodes, allowEmpty) {
		if (allowEmpty && digit($nodes, 0)) {
			return true;
		}
		return /^0/.test($nodes.first().val());
	};
	validators.startWithZero = startWithZero;

	// ���p�����`�F�b�N
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

	// ���[�U�[ID�`�F�b�N
	// �Ɩ��v��: �p��1���� + ����7�����̑g�ݍ��킹�͋֎~
	var userid = (function() {
		var chekcer = /^(?:[a-zA-Z][0-9]{7})$/;
		return function(node) {
			return !chekcer.test($(node).val());
		}
	})();
	validators.userid = userid;

	// ���[�UID�����`�F�b�N
	// �Ɩ��v��: 6���ȏ�A8���ȉ�
	var useridLength = function(node) {
		var value = $(node).val();
		return (
				 value.length >= 6
			&& value.length <= 8
		)
	};
	validators.useridLength = useridLength;

	// �p�X���[�h�`�F�b�N
	// �Ɩ��p��: �u6 ~ 8 �����̉p�����̑g�ݍ��킹�v
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

	// ���p�p���`�F�b�N
	var eisu = function(node) {
		var checker = /^[0-9a-zA-Z]*$/;
		return checker.test($(node).val());
	};
	validators.eisu = eisu;

	// �����`�F�b�N
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

	// �G���[���b�Z�[�W��\������
	validators.showError = function showError(el, message) {
		$(el)
			.parents('tr')
			.find('.error-message-area')
			.show()
			.addClass('error-message')
			.html(validators.messageArea(message));
		$(el).parents('td').addClass('error-section');
	};

	// �G���[���b�Z�[�W���N���A����
	validators.clearError = function clearError(el) {
		$(el)
			.parents('tr')
			.find('.error-message-area')
			.removeClass('error-message')
			.empty();
		$(el).parents('td').removeClass('error-section');
	};

	// *message* ��\�����邽�߂� DOM �������Ԃ�
	validators.messageArea = function messageArea(message) {
		return [
				'<ul class="error-list">'
			,   '<li>'
			,     message
			,   '</li>'
			, '</ul>'
		].join('');
	};

	// �K�{�A�C�R������͊����̏�Ԃɂ���
	validators.filledText = function filledText(el) {
		$(el).parents('tr').find('.required-image').css({opacity: 0.5});
	};

	// �K�{�A�C�R������͖������̏�Ԃɂ���
	validators.emptyedText = function emptyedText(el) {
		$(el).parents('tr').find('.required-image').css({opacity: 1.0});
	};

	// �O���[�v�̊T�O���Ǘ����邽�߂ɁA�O�� focus ���Ă����I�u�W�F�N�g���Ǘ�����
	// 'blur' �̒���̃^�C�~���O�� 'exit' �C�x���g�𔭉΂����܂��B
	// 'exit' �C�x���g���Ύ��ɂ́A���O�� focus ����Ă��� DOM �v�f�������Ŏ󂯎��܂��B
	// �������ڂłЂƂ̓��̓t�H�[����\������ꍇ�́Afocus out �Ȃǂɗ��p���邱�Ƃ��ł��܂��B
	validators.enableContextListener = function() {
		// ���� focus ���������Ă��� DOM �v�f
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

	// input, select �v�f�� disable/enable �ؑւ��s��
	var enableinputs = {};
	var enableinputstxt = {};
	window.enableinputs = enableinputs;
	window.enableinputstxt = enableinputstxt;
	enableinputstxt.value = {};

	// �y�[�W���[�h���̃e�L�X�g����disable�Aenable�`�F�b�N�Ɠ��͒l�ꎞ�i�[�ϐ��̐ݒ�
	$('[data-validate-enable-for]').each(function() {
		var enableSelector = $(this).attr('data-validate-enable-for');
		var $enableFor = $(enableSelector);
		$enableFor.removeClass('ad').addClass('da');
		var id = $enableFor.attr('name');
		enableinputstxt.value[id] = '';

		// enable�̍��ڂɂ̓N���X�ǉ��폜
		if ($(this).is(':checked') && ($(this).is(':checkbox') || $(this).is(':radio'))) {
			$enableFor.removeClass('da').addClass('ad');
		}
		if ($(this).parent().is('select')) {
			var selectedSelector = $(this).parent().find('option:selected').attr('data-validate-enable-for');
			$(selectedSelector).removeClass('da').addClass('ad');
		}
	});

	// disable enable�ؑ֎��̃X�^�C���ؑւ�disable���̃e�L�X�g���͒l�̈ꎞ�ۑ�
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

	// validate �C�x���g���Ϗ�����
	$(document).delegate('*', 'validate', function() {
		$(this).trigger('blur');
	});

}(jQuery);

// Executions
jQuery(function($) {
	var validators = window.validators;

	// 'exit' �C�x���g��L���ɂ���
	validators.enableContextListener();

	var showError = validators.showError;
	var clearError = validators.clearError;
	var filledText = validators.filledText;
	var emptyedText = validators.emptyedText;
	// *node* �̃��x�����擾����
	var getLabel = function(node) {
		var label = $(node).data('validateLabel');
		var tr = $(node).parents('tr');
		label = label
			|| tr.find('.fl').first().text()
			|| tr.find('.lv2-2').first().text()
			|| tr.find('strong').first().text();
		return label;
	};
	// �K�{�A�C�R���̕\����؂�ւ���
	var toggleRequiredMark = function(filled, el) {
		if (filled) {
			filledText(el);
		} else {
			emptyedText(el);
		}
		return filled;
	}

	console.log('** page loaded **');

	// select �� validate ��ݒ� (focus ���ɂ� validate ���s��Ȃ�)
	_(['change', 'exit']).each(function(type) {

		// select �^�O�̑I���`�F�b�N (29 ���X�g�I��)
		$(document).delegate('[data-validate-selected]', type, function(e) {
			var $nodes = $(this).parents('td').find('select');
			var message = $(this).data('validateMessage') || getLabel(this) + '��I�����Ă��������B';

			var valid = true;
			// �ǉ����͍��ڂ̗L��/�����ݒ�
			_($(this).find(':not(:selected)')).each(function(node) {
				var $disableTarget = $($(node).attr('data-validate-enable-for'));
				// disable���̃X�^�C���ݒ�Ɠ��̓e�L�X�g���\�����邽�߂̓��͂��ꎞ�ۑ�
				if ($disableTarget.size() > 0) {
					enableinputs.enableinputstyle($disableTarget, true);
				}
			});

			var enableSelector = $(this).find(':selected').attr('data-validate-enable-for');
			if (enableSelector) {
				var $enableFor = $(enableSelector);
				if (e.type === 'change') {
					// enable���̃X�^�C���ݒ�ƕۑ����ē��͒l��߂�
					if ($enableFor.size() > 0) {
						enableinputs.enableinputstyle($enableFor, false);
					}
				}

				// select + text �̃`�F�b�N
				valid = !!$enableFor.val();
			}

			// �K�{�I���`�F�b�N
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

	// checkbox, radio �� validate ��ݒ�
	_(['change', 'focus', 'exit']).each(function(type) {

		// �`�F�b�N�{�b�N�X�̕K�{�`�F�b�N (26 ���W�I�{�^���I��, 33 �`�F�b�N�{�b�N�X)
		$(document).delegate('[data-validate-checked]', type, function(e, context) {
			var $nodes = $(this).parents('td').find('input');
			var message;

			// �ǉ����͍��ڂ̗L��/�����ݒ�(radio�p)
			if ($(this).is(':checked')) {
				var $disableTarget = $($(this).attr('data-validate-disable-for'));

				// disable���̃X�^�C���ݒ�Ɠ��̓e�L�X�g���\�����邽�߂̓��͂��ꎞ�ۑ�
				if ($disableTarget.size()) {
					enableinputs.enableinputstyle($disableTarget, true);
				}

				if (e.type === 'change') {
					var $enableTarget = $($(this).attr('data-validate-enable-for'));

					// enable���̃X�^�C���ݒ�ƕۑ����ē��͒l��߂�
					if ($enableTarget.size()) {
						enableinputs.enableinputstyle($enableTarget, false);
						clearError($enableTarget);
					}
				}
			}

			if (_($nodes).contains(context)) { return true; }
			var message = getLabel(this) + '��I�����Ă��������B';

			// �K�{�I���`�F�b�N
			var valid = validators.checked($nodes);
			if (_(['exit', 'change']).contains(e.type) && !valid) {
				showError(this, message);
				emptyedText(this);
				return true;
			}

			// IE �̏ꍇ�A���̃`�F�b�N���Ȃ��� validation �̃��b�Z�[�W���\������Ă��܂�
			// ����́A event ���΂̃^�C�~���O�̋����̈Ⴂ�̂���
			// �t�����͍��ڂ̃`�F�b�N
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

		// Club toto ���p���̑ΏۃJ�[�h�I���`�F�b�N (25 �J�[�h�I��)
		$(document).delegate('[data-validate-card-checked]', type, function(e, context) {
			var $nodes = $('[data-validate-card-checked]');

			var $messageArea = $('.error-message-area');

			if (_($nodes).contains(context)) { return true; }

			var showError = function() {
				$messageArea
					.show()
					.addClass('error-message')
					.html(validators.messageArea('�J�[�h��I�����Ă��������B'));
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

		// ���Ӄ`�F�b�N�{�b�N�X (31 ���Ӄ`�F�b�N)
		$(document).delegate('[data-validate-agree-checked]', type, function(e, context) {
			var $messageArea = $(this).parent().find('.error-message-area')
			var label = '�l���̎戵���Ɋւ��铯�ӏ����ɓ��ӂ���'
			if (validators.checked($(this))) {
				$messageArea.empty();
			} else {
				var message = validators.messageArea('���ӂ���������ꍇ��' + label + '�Ƀ`�F�b�N�����Ă��������B');
				$messageArea.html(message);
			}
		});

		// �o���f�[�g�͍s��Ȃ����A ���̍��ڂ� enable / disable ����K�v������v�f�̃C�x���g��ݒ�
		$(document).delegate('[data-validate-eventable]', type, function(e, context) {
			// �ǉ����͍��ڂ̗L��/�����ݒ�(radio�p)
			var $enableTarget = $($(this).attr('data-validate-enable-for'));
			var $disableTarget = $($(this).attr('data-validate-disable-for'));
			if ($(this).is(':checked')) {
				$disableTarget.attr('disabled', true);
				$enableTarget.attr('disabled', false);

				// disable enable�ؑ֎��̃X�^�C���ݒ�
				if (e.type === 'change') {
					// disable���̃X�^�C���ݒ�Ɠ��̓e�L�X�g���\�����邽�߂̓��͂��ꎞ�ۑ�
					if ($disableTarget.size() > 0){
						enableinputs.enableinputstyle($disableTarget, true);
					} else {
					// enable���̃X�^�C���ݒ�ƕۑ����ē��͒l��߂�
						enableinputs.enableinputstyle($enableTarget, false);
					}
				}
			}
			// �K�{���ڂł͂Ȃ��̂ŁA��x�N���A����
			// ���Ƃ́Aenable �ɂȂ������ڂɂ܂�����
			clearError(this);
		});

		// �����̃O���[�v�ɂ܂������� radio �̃`�F�b�N (27 ���W�I�{�^���I���{�e�L�X�g, 28 ���W�I�{�^���I���{���p�����e�L�X�g)
		$(document).delegate('input[type=radio][data-validate-multi-checked]', type, function(e, context) {
			// ������ td ���܂������O���[�v�ɂȂ��Ă���
			var $nodes = $('input[type=radio][data-validate-multi-checked=' + $(this).attr('data-validate-multi-checked') + ']')
			var $topNode = $nodes.first();
			var label = getLabel(this);

			// group �̃X�L�b�v
			if (_($nodes).contains(context)) { return true; }

			var valid = validators.checked($nodes);
			if (!valid) {
				if (e.type === 'exit') {
					showError($topNode, label + '��I�����Ă��������B');
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

		// �����̃O���[�v�ɂ܂������� checkbox �̃`�F�b�N (33 �`�F�b�N�{�b�N�X, 34 �`�F�b�N�{�b�N�X�{���X�g, 35 �`�F�b�N�{�b�N�X�{�e�L�X�g)
		$(document).delegate('input[type=checkbox][data-validate-multi-checked]', type, function(e, context) {
			// ������ td ���܂������O���[�v�ɂȂ��Ă���
			var $nodes = $('input[type=checkbox][data-validate-multi-checked=' + $(this).attr('data-validate-multi-checked') + ']')
			var $topNode = $nodes.first();
			var $lastNode = $nodes.last();
			var topLable = getLabel($topNode);
			var lastLable = getLabel($lastNode);

			// �ǉ����͍��ڂ̗L��/�����ݒ�(checkbox�p)
			var $enableTarget = $($(this).attr('data-validate-enable-for'));
			if ($enableTarget.length >= 0) {
				if ($(this).is(':checked')) {
					if (e.type === 'change') {
						// enable���̃X�^�C���ݒ�ƕۑ����ē��͒l��߂�
						if ($enableTarget.size()) {
							enableinputs.enableinputstyle($enableTarget, false);
						}
					}
				} else {
					// disable���̃X�^�C���ݒ�Ɠ��̓e�L�X�g���\�����邽�߂̓��͂��ꎞ�ۑ�
					if ($enableTarget.size()) {
						enableinputs.enableinputstyle($enableTarget, true);
					}
				}
			}

			// group �̃X�L�b�v
			if (_($nodes).contains(context)) { return true; }

			var valid = validators.checked($nodes);
			if (_(['exit', 'change']).contains(e.type) && !valid) {
				clearError($lastNode); // �ЂƂ��`�F�b�N����Ă��Ȃ��ꍇ�A `$lastNode` �ɂ̓G���[���\������Ă��Ȃ�����
				showError($topNode, topLable + '��' + lastLable + '�͂����ꂩ1�ȏ��I�����Ă��������B');
				emptyedText($topNode);
				return true;
			}

			// �t�����͍��ڂ̃`�F�b�N (�֘A: 27 ���W�I�{�^���I���{�e�L�X�g, 35 �`�F�b�N�{�b�N�X�{�e�L�X�g)
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

		// �`�F�b�N�{�b�N�X ON �ŗL���ɂȂ�e�L�X�g�K�{�̃`�F�b�N (34 �`�F�b�N�{�b�N�X�{���X�g)
		$(document).delegate('[data-validate-multi-checked-with-select]', type, function(e, context) {
			var el = this;
			// ������ td ���܂������O���[�v�ɂȂ��Ă���
			var $nodes = $('[data-validate-multi-checked-with-select=' + $(this).attr('data-validate-multi-checked-with-select') + ']')
			var $topNode = $nodes.first();
			var $lastNode = $nodes.last();
			var label = getLabel(this);

			// �ǉ����͍��ڂ̗L��/�����ݒ�(checkbox�p)
			var $enableTarget = $($(this).attr('data-validate-enable-for'));
			if ($enableTarget.length >= 0) {
				// �����͒l�̕ۑ����s���Ȃ�(change �C�x���g�̔��΂��]�܂����Ȃ�)���߁A���Ő؂�ւ��w����s��
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

			// group �̃X�L�b�v
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
					showError($topNode, label + '��I�����Ă��������B');
					$lastNode.parents('td').addClass('error-section');
				}
			}
		});
	});

	// focus �������Ă����C�x���g�ł���� `true` ��Ԃ�
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

	// text �̒��ŕ�������ɂ����C�x���g�ł���� `true` ��Ԃ�
	// ��̏�Ԃ� text �� focus ������ԂƋ�ʂ��邽�߂ɗ��p���Ă���
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

	// *event* �C�x���g�̃R�[���o�b�N�Ƃ��� *callback* �� *selector* �ɍ��v���� DOM �v�f�ɐݒ肷��
	var bindEvent = function(selector, event, callback) {
		// ie7 �ł� keyup �΍�: �{���ł���΁A���� each �͕s�v
		_($(selector)).each(function(node) {
			$(node).bind(event, callback);
		});
	};

	// �y�[�X�g�֎~ (�֘A: 22 �p�X���[�h, 15 �J�[�h�Ïؔԍ�)
	bindEvent('[data-validate-from-paste]', 'paste', function(e, context) {
		var $el = $(this);
		var before = $el.val();
		$el.data('pasteMessageShowing', true);
		showError(this, getLabel(this) + '�͒��ړ��͂��Ă��������B');
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

	// �y�[�X�g�֎~ (�֘A: 22 �p�X���[�h, 15 �J�[�h�Ïؔԍ�)
	// �G���[���b�Z�[�W�\�����ɓ��͂���Ă�����e���ω��������ǂ������Ǘ����Ă���
	bindEvent('[data-validate-from-paste]', 'keyup', function(e, context) {
		var beforeValue = $(this).data('beforeValue');
		var currentValue = $(this).val();
		if (currentValue && (beforeValue !== currentValue)) {
			$(this).data('pasteMessageShowing', false);
		}
		$(this).data('beforeValue', $(this).val());
	});

	// text �� validate ��ݒ�
	_(['keyup', 'focus', 'exit']).each(function(type) {

		// �O���[�v������Ă��Ȃ� input[type=text] �ɃC�x���g��ݒ肷��

		// �S�p�����`�F�b�N (03 �S�p�w��)
		bindEvent('[data-validate-zenkaku]', type, function(e, context) {
			var $nodes = $(this).parents('td').find('input');
			var required = $(this).data('validateZenkaku') || !$(this).data('validateOptional');
			var label = getLabel(this);

			// �K�{���̓`�F�b�N
			var valid = true;
			if (required) {
				valid = validators.required($nodes);
			}
			if (e.type === 'exit' && !valid) {
				showError(this, label + '����͂��Ă��������B');
				emptyedText(this);
				return true;
			}

			if (!validators.startWithSpaceban($nodes)) {
				showError(this, label + '�͑S�p�œ��͂��Ă��������B');
				emptyedText(this);
				return true;
			}

			if (!validators.zenkaku($nodes)) {
				showError(this, label + '�͑S�p�œ��͂��Ă��������B');
				emptyedText(this);
				return true;
			}

			if (isEntered(e) || valid) {
				clearError(this);
			}
			toggleRequiredMark(valid, this);
		});

		// �S�p�J�i�����`�F�b�N (04 �S�p�J�i�w��)
		bindEvent('[data-validate-zenkakukana]', type, function(e, context) {
			var $nodes = $(this).parents('td').find('input');
			var required = $(this).data('validateZenkakukana') || !$(this).data('validateOptional');
			var label = getLabel(this);

			// �K�{���̓`�F�b�N
			var valid = true;
			if (required) {
				valid = validators.required($nodes);
			}
			if (e.type === 'exit' && !valid) {
				showError(this, label + '����͂��Ă��������B');
				emptyedText(this);
				return true;
			}

			if (!validators.startWithSpaceban($nodes)) {
				showError(this, label + '�͑S�p�œ��͂��Ă��������B');
				emptyedText(this);
				return true;
			}

			// �S�p�J�i
			if (!validators.zenkakukana($nodes)) {
				showError(this, label + '�͑S�p�J�i�œ��͂��Ă��������B');
				emptyedText(this);
				return true;
			}

			if (isEntered(e) || valid) {
				clearError(this);
			}
			toggleRequiredMark(valid, this);
		});

		// �����`�F�b�N (09 ���p����)
		bindEvent('[data-validate-integer]', type, function(e, context) {
			var $nodes = $(this).parents('td').find('input');
			var label = getLabel(this);
			var required = $(this).data('validateInteger');

			var valid = true;
			if (required) {
				valid = validators.required($nodes);
			}
			if (e.type === 'exit' && !valid) {
				showError(this, label + '����͂��Ă��������B')
				emptyedText(this);
				return true;
			}
			if (!validators.hankakunum($nodes)) {
				showError(this, label + '�͔��p�����œ��͂��Ă��������B');
				emptyedText(this);
				return true;
			}
			var value = $(this).val();
			if (e.type === 'exit' && value) {
				// �擪 0 (�����)�����
				$(this).val(Number(value));
			}

			if (isEntered(e) || valid) {
				clearError(this);
			}
			toggleRequiredMark(valid, this);
		});

		// �Ƌ��ؔԍ��`�F�b�N (10 ���p�������w��)
		bindEvent('[data-validate-drivers-license]', type, function(e) {
			var $nodes = $(this).parents('td').find('input');
			var $topNode = $nodes.first();
			var label = getLabel(this);

			var validRequired = validators.required($nodes);
			if (!validRequired) {
				if (e.type === 'exit') {
					showError(this, '�Ƌ��ؔԍ�����͂��Ă��������B');
					emptyedText(this);
				}
				// �蓮�ŋ�ɂ����ꍇ�̓G���[���b�Z�[�W���\���ɂ���
				if (e.type === 'keyup') {
					clearError(this);
				}
				$topNode.data('invalidDigit', false);
				return true;
			}
			var valid = true;

			var validNum = validators.hankakunum($nodes);
			if (!validNum) {
				showError(this, label + '��12���̔��p�����œ��͂��Ă��������B');
				emptyedText(this);
				$topNode.data('invalidDigit', false);
				return true;
			}
			valid = valid && validNum;

			// �����`�F�b�N
			var validDigit = validators.digit($nodes, 12);
			if (!validDigit) {
				if (!$topNode.data('invalidDigit')) {
					clearError(this);
				}
				if (e.type === 'exit') {
					$topNode.data('invalidDigit', true);
					showError(this, label + '��12���̔��p�����œ��͂��Ă��������B');
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

		// �J�[�h�Ïؔԍ��`�F�b�N (15 �J�[�h�Ïؔԍ�)
		bindEvent('[data-validate-secret-card-number]', type, function(e) {
			if ($(this).data('pasteMessageShowing')) {
				return true;
			};
			var label = getLabel(this);

			// �K�{���̓`�F�b�N
			var validRequired = validators.required($(this));
			if (!validRequired) {
				if (e.type === 'exit') {
					showError(this, label + '����͂��Ă��������B');
					emptyedText(this);
				}
				if (isCleared(e) || $(this).val()) {
					clearError(this);
				}
				$(this).data('invalidDigit', false);
				return true;
			}
			var valid = true;
			var message = label + '��4���̔��p�����œ��͂��Ă��������B';

			// ���p�����`�F�b�N
			var validNum = validators.hankakunum($(this));
			if (!validNum) {
				showError(this, message);
				emptyedText(this);
				$(this).data('invalidDigit', false);
				// valid = false
				return true;
			}

			// �����`�F�b�N
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

		// ���X�g�I���� "���̑�" �I�����̃e�L�X�g�K�{�`�F�b�N (�֘A: 30 ���X�g�I���{�e�L�X�g)
		bindEvent('[data-validate-required-if-selected]', type, function(e) {
			var label = getLabel(this);

			var selectedLabel = $(this).parents('td').find(':selected').text();
			var valid = validators.required($(this));
			if (e.type === 'exit' && !valid) {
				showError(this, label + '��' + selectedLabel + '��I�������ꍇ�͋�̓I�ȓ��e����͂��Ă��������B')
				emptyedText(this);
				return true;
			}

			// ������ `isEntered(e)` �͕s�v
			if (valid) {
				clearError(this);
			}
			toggleRequiredMark(valid, this);
		});

		// ���W�I�A�`�F�b�N�{�b�N�X�� "���̑�" �I�����̃e�L�X�g�K�{�`�F�b�N (27 ���W�I�{�^���I���{�e�L�X�g, 34 �`�F�b�N�{�b�N�X�{���X�g)
		bindEvent('[data-validate-required-if-checked]', type, function(e) {
			var $nodes = $(this).parents('td').find('input');
			var label = getLabel(this);

			var checkedLabel = $(this).data('validateRequiredIfChecked');
			var valid = validators.required($(this));
			if (!valid) {
				if (e.type === 'exit') {
					showError(this, label + '��' + checkedLabel + '��I�������ꍇ�͋�̓I�ȓ��e����͂��Ă��������B')
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
					// �擪 0 (�����)�����
						$(this).val(Number(value));
					}
				} else {
					showError(this, label + '�͔��p�����œ��͂��Ă��������B');
					emptyedText(this);
					valid = false;
				}
			}

			// ������ `isEntered(e)` �͕s�v
			if (valid) {
				clearError(this);
			}
			toggleRequiredMark(valid, this);
		});

		// �ŏ����ʃ`�F�b�N (17 �ڍs�|�C���g, 18 ����)
		bindEvent('[data-validate-point-min-count]', type, function(e, context) {
			var label = $(this).data('validateLabel') || '�ڍs�|�C���g';
			var $mark = $('#point_icon');
			var $el = $(this);
			var min = $(this).data('validatePointMinCount');

			var valid = true;

			// �K�{���̓`�F�b�N
			var validRequired = validators.required($(this));
			if (!validRequired) {
				valid = false;
				if (e.type === 'exit') {
					showError(this, label + '����͂��Ă��������B');
					emptyedText($mark);
				}
				if (isCleared(e) || $(this).val()) {
					clearError(this);
				}
				return true;
			}
			valid = valid && validRequired;

			var message = label + '��' + min + '�ȏ�̔��p�����œ��͂��Ă��������B';

			// ���p�����`�F�b�N
			var validNum = validators.hankakunum($(this));
			if (!validNum) {
				showError(this, message);
				emptyedText($mark);
				return true;
			}
			valid = valid && validNum;

			// ��`�`�F�b�N(`min` �ȏ�)
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

		// �ŏ����z�`�F�b�N (11 �����p���z)
		bindEvent('[data-validate-min-amount]', type, function(e, context) {
			var label = getLabel(this);

			// �K�{���̓`�F�b�N
			var validRequired = validators.required($(this));
			if (!validRequired) {
				valid = false;
				if (e.type === 'exit') {
					showError(this, label + '����͂��Ă��������B');
					emptyedText(this);
				}
				if (isCleared(e) || $(this).val()) {
					clearError(this);
				}
				return true;
			}

			var message = label + '��1���~�ȏ�1���~�P�ʂœ��͂��Ă��������B';

			// ���p�����`�F�b�N
			var validNum = validators.hankakunum($(this));
			if (!validNum) {
				showError(this, message);
				emptyedText(this);
				return true;
			}

			var value = $(this).val();
			var valueAsNumber = Number(value);
			// ��`�`�F�b�N
			if (valueAsNumber < 1) {
				showError(this, message)
				emptyedText(this);
				return true;
			}

			// ���̑��`�F�b�N
			var availableAmountText = $(this).parents('table').find('tr:eq(1) td:first').text();;
			// ������ "���~" ���폜���� Number �^�֕ϊ�����
			var availableAmount = parseInt(availableAmountText, 10);
			if (availableAmount < valueAsNumber) {
				showError(this, '�����p���z�͂����p�\���x�z�ȓ��œ��͂��Ă��������B');
				emptyedText(this);
				return true;
			}

			if (e.type === 'exit' && value) {
				$(this).val(valueAsNumber);
			}

			clearError(this);
			filledText(this);
		});

		// ���`�F�b�N (16 ������)
		bindEvent('[data-validate-product-count]', type, function(e, context) {
			var $nodes = $('[data-validate-product-count]');
			var $mark = $(this).parents('table').find('th:eq(3) .fl').first();
			var label = $mark.text();
			var message = label + '����͂��Ă��������B';

			// �K�{�`�F�b�N
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

			message = label + '��1�ȏ�̔��p�����œ��͂��Ă��������B';

			// ���p�����`�F�b�N
			var validNum = validators.hankakunum($(this));
			if (!validNum) {
				showError(this, message);
				emptyedText($mark);
				return true;
			}

			var rawValue = $(this).val();
			var value = Number(rawValue);
			// ��`�`�F�b�N(1 �ȏ�)
			if (value < 1) {
				showError(this, message);
				emptyedText($mark);
				return true;
			}

			// ���`�F�b�N���s���\��ł��������A�d�l�ύX�ɂ��s��Ȃ����ƂɂȂ���

			if (e.type === 'exit') {
				$(this).val(value);
			}

			clearError(this);
			var allValid = _($nodes).all(validators.required);
			toggleRequiredMark(allValid, $mark);
		});

		// �}�C���[�W�`�F�b�N TODO
		bindEvent('[data-validate-myrage]', type, function(e, context) {
			var label = getLabel(this);
			var valid = true;

			// �K�{���̓`�F�b�N
			var validRequired = validators.required($(this));
			if (!validRequired) {
				if (e.type === 'exit') {
					showError(this, label + '����͂��Ă��������B');
					emptyedText(this);
				}
				// �蓮�ŋ�ɂ����ꍇ�̓G���[���b�Z�[�W���\���ɂ���
				if (e.type === 'keyup') {
					clearError(this);
				}
				$(this).data('invalidDigit', false);
				return true;
			}
			valid = valid && validRequired;

			var message = label + '��7����������9���̔��p�����œ��͂��Ă��������B';

			// ���p�����`�F�b�N
			var validNum = validators.hankakunum($(this));
			if (!validNum) {
				showError(this, message);
				emptyedText(this);
				$(this).data('invalidDigit', false);
				return true;
			}
			valid = valid && validNum;

			// �����`�F�b�N
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

		// �O���[�v���ڂ̃��A���^�C���`�F�b�N

		// �Œ�d�b�ԍ��A�g�ѓd�b�ԍ��A�d�b�ԍ� (05 �Œ�d�b�ԍ�, 06 �g�ѓd�b�ԍ�, 07 �d�b�ԍ�)
		bindEvent('[data-validate-phone]', type, function(e, context) {
			var $nodes = $(this).parents('td').find('input');
			var $topNode = $nodes.first();
			var phoneType = $(this).data('validatePhone');
			var optional = $(this).data('validateOptional');
			var label = getLabel(this);

			// group �̃X�L�b�v
			if (_($nodes).indexOf(context) >= 0) { return true; }

			var message;
			var validator;
			if (phoneType === 'land') {
				message = '�Œ�d�b�ԍ���0����n�܂�A�e���ڂ̍��v��10���ƂȂ锼�p�����œ��͂��Ă��������B';
				validator = validators.landPhone;
			} else if (phoneType === 'mobile') {
				message = '�g�ѓd�b�ԍ���0����n�܂�A�e���ڂ̍��v��11���ƂȂ锼�p�����œ��͂��Ă��������B';
				validator = validators.mobilePhone;
			} else if (phoneType === 'some') {
				message = '�d�b�ԍ���0����n�܂�A�e���ڂ̍��v��10���܂���11���ƂȂ锼�p�����œ��͂��Ă��������B';
				validator = validators.phone;
			} else {
				throw 'Unsupported phone type "' + phoneType + '".';
			}

			// focusout �̍ۂ̌����`�F�b�N�Ɉ������������ꍇ�A
			// ���̃G���[�����������܂ŃG���[���b�Z�[�W��\�����Ă����K�v������B
			// ��L�̏�Ԃ�ێ����Ă������߁A�ȉ��̃t���O�𗘗p���Ă���
			// `$topNode.data('invalidDigit');`

			var validRequired = validators.required($nodes);
			if (!validRequired) {
				if (e.type === 'exit') {
					if (optional) {
						clearError(this);
						filledText(this);
					} else {
						showError(this, label + '����͂��Ă��������B');
						emptyedText(this);
					}
				}
				// �蓮�ŋ�ɂ����ꍇ�̓G���[���b�Z�[�W���\���ɂ���
				if (isCleared(e) || $(this).val()) {
					clearError(this);
				}
				$topNode.data('invalidDigit', false);
				return true;
			}
			var valid = true;

			// �擪������ 0 �`�F�b�N
			var validZero = validators.startWithZero($topNode, true);
			if (!validZero) {
				$topNode.data('invalidDigit', false);
				showError(this, message);
				emptyedText(this);
				return true;
			}
			valid = valid && validZero;

			// ���p�����`�F�b�N
			var validNum = validators.hankakunum($nodes);
			if (!validNum) {
				$topNode.data('invalidDigit', false);
				showError(this, message);
				emptyedText(this);
				return true;
			}
			valid = valid && validNum;

			// �����`�F�b�N
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

		// �Œ�d�b�A �g�ѓd�b �����ꂩ�K�{ (05 �Œ�d�b�ԍ�, 06 �g�ѓd�b�ԍ�)
		bindEvent('[data-validate-multi-phone]', type, function(e, context) {
			var $nodes = $('[data-validate-multi-phone]'); // ������ td ���܂����ŃO���[�v�ɂȂ��Ă���
			var $node = $(this);
			var $topNode = $nodes.first();
			var $lastNode = $nodes.last();
			var computeKey = function(node) {
				return Math.floor(_($nodes).indexOf(node) / 3);
			};
			var groupedNodes = _($nodes).groupBy(computeKey);
			var topLabel = getLabel($topNode);
			var lastLabel = getLabel($lastNode);

			// �d�b�ԍ��� group �Ԃ̈ړ��̏ꍇ�A�K�{�`�F�b�N�͍s��Ȃ�
			if (!_($nodes).contains(context)) {
				// �K�{���̓`�F�b�N
				var valid = validators.required($nodes);
				if (e.type === 'exit' && !valid) {
					showError($topNode, topLabel + '��' + lastLabel + '�͂����ꂩ����܂��͗�������͂��Ă��������B');
					return true;
				}
			}

			// group �̃X�L�b�v
			if (_(groupedNodes[computeKey(this)]).contains(context)) { return true; }

			// �ǂꂼ��̃O���[�v���Ɍ��؂��Ă���
			_(groupedNodes).each(function(nodes, key) {
				var $nodes = $(nodes);
				var $headNode = $nodes.first();
				var phoneType = $($headNode).data('validateMultiPhone');
				var optional = $($headNode).data('validateOptional');
				var label = getLabel($headNode);

				var message;
				var validator;
				if (phoneType === 'land') {
					message = '�Œ�d�b�ԍ���0����n�܂�A�e���ڂ̍��v��10���ƂȂ锼�p�����œ��͂��Ă��������B';
					validator = validators.landPhone;
				} else if (phoneType === 'mobile') {
					message = '�g�ѓd�b�ԍ���0����n�܂�A�e���ڂ̍��v��11���ƂȂ锼�p�����œ��͂��Ă��������B';
					validator = validators.mobilePhone;
				} else if (phoneType === 'some') {
					message = '�d�b�ԍ���0����n�܂�A�e���ڂ̍��v��10���܂���11���ƂȂ锼�p�����œ��͂��Ă��������B';
					validator = validators.phone;
				} else {
					throw 'Unsupported phone type "' + phoneType + '".';
				}

				// focusout �̍ۂ̌����`�F�b�N�Ɉ������������ꍇ�A
				// ���̃G���[�����������܂ŃG���[���b�Z�[�W��\�����Ă����K�v������B
				// ��L�̏�Ԃ�ێ����Ă������߁A�ȉ��̃t���O�𗘗p���Ă���
				// `$headNode.data('invalidDigit');`

				var validRequired = validators.required($nodes);
				if (!validRequired) {
					// �蓮�ŋ�ɂ����ꍇ�̓G���[���b�Z�[�W���\���ɂ���
					if (isCleared(e) || $node.val()) {
						clearError($headNode);
					}
					$headNode.data('invalidDigit', false);
					return true;
				}

				// �擪������ 0 �`�F�b�N
				var validZero = validators.startWithZero($headNode, true);
				if (!validZero) {
					$headNode.data('invalidDigit', false);
					showError($headNode, message);
					valid = false;
					return true;
				}

				// ���p�����`�F�b�N
				var validNum = validators.hankakunum($nodes);
				if (!validNum) {
					$headNode.data('invalidDigit', false);
					showError($headNode, message);
					valid = false;
					return true;
				}

				// �����`�F�b�N
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

			// group ���̈ړ��̍ۂ̃`���c�L�h�~
			if (!_($nodes).contains(context)) {
				toggleRequiredMark(valid, $topNode);
			}
		});

		// �X�֔ԍ� (08 �X�֔ԍ�)
		bindEvent('[data-validate-zip]', type, function(e, context) {
			var $nodes = $(this).parents('td').find('input');
			var $node = $(this);
			var $topNode = $nodes.first();
			var label = getLabel(this);

			// group �̃X�L�b�v
			if (_($nodes).contains(context)) { return true; }

			// focusout �̍ۂ̌����`�F�b�N�Ɉ������������ꍇ�A
			// ���̃G���[�����������܂ŃG���[���b�Z�[�W��\�����Ă����K�v������B
			// ��L�̏�Ԃ�ێ����Ă������߁A�ȉ��̃t���O�𗘗p���Ă���
			// `$topNode.data('invalidDigit');`

			// �K�{���̓`�F�b�N
			var validRequired = validators.required($nodes);
			if (!validRequired) {
				if (e.type === 'exit') {
					showError(this, label + '����͂��Ă��������B');
					emptyedText(this);
				}
				// �蓮�ŋ�ɂ����ꍇ�̓G���[���b�Z�[�W���\���ɂ���
				if (isCleared(e) || $node.val()) {
					clearError(this);
				}
				$topNode.data('invalidDigit', false);
				return true;
			}
			var valid = true;

			// ���p�����`�F�b�N
			var validNum = validators.hankakunum($nodes);
			if (!validNum) {
				$topNode.data('invalidDigit', false);
				showError(this, '�X�֔ԍ���3��+4���̔��p�����œ��͂��Ă��������B');
				emptyedText(this);
				return true;
			}
			valid = valid && validNum;

			// �����`�F�b�N
			var validDigit = validators.digit($nodes, 7);
			if (!validDigit) {
				valid = false;
				if (!$topNode.data('invalidDigit')) {
					clearError(this);
				}
				if (e.type === 'exit'){
					$topNode.data('invalidDigit', true);
					showError(this, '�X�֔ԍ���3��+4���̔��p�����œ��͂��Ă��������B');
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

		// �J�[�h�ԍ��̃`�F�b�N (20 �J�[�h�ԍ�)
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

			// group �̃X�L�b�v
			if (_(groupedNodes[format]).contains(context)) { return true; }

			var validRequired = validators.required($nodes);
			if (!validRequired) {
				if (e.type === 'exit') {
					clearError($lastNode);
					showError($topNode, label + '����͂��Ă��������B');
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

			// �ЂƂЂƂ`�F�b�N���s��
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
					return digit + '��';
				}).join('+');

				var label = totalDigit + '���̃J�[�h�ԍ�';
				var message = label + '��' + format + '�̔��p�����œ��͂��Ă��������B';

				if ($nodes.data('invalidDigit')) {
					childValid = true;
					errorShown = true;
				}

				// �����͂����e����
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

				// ���p�����`�F�b�N
				var validNum = validators.hankakunum($nodes);

				if (!validNum) {
					showError($top, message);
					errorShown = true;
					childValid = false;
				}

				// �����`�F�b�N
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

			// 16���A14�������̍��ڂɒl������̂͋��e����Ȃ�
			var multple = _(groupedNodes).all(function(nodes, key) {
				return _(nodes).any(validators.required);
			});

			var showMultipleMessage = function(el) {
				if (!$context.data('multipleInvalid')) {
					$context.data('multipleInvalid', el);
				}
				showError($($context.data('multipleInvalid')), '�J�[�h�ԍ���16����������14���̂ǂ��炩����݂̂ɓ��͂��Ă��������B');
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

		// ���[�U�[ ID �`�F�b�N (21 ���[�U�[�h�c)
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

			// �K�{���̓`�F�b�N
			var validRequired = validators.required($nodes);
			if (!validRequired) {
				clearIfContextError();
				clearContext();
				if (e.type === 'exit') {
					showError($topNode, label + '����͂��Ă��������B');
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
				showError(this, label + '��6�`8�����̔��p�p�����œ��͂��Ă��������B');
				$topNode.data('invalidDigit', false);
				return true;
			}

			// �p��1��+����7���̑g�ݍ��킹���֎~����(���R�͕s��)
			// �v���ɂ��A���b�Z�[�W�𑼂̉ӏ��Ɠ��ꂷ��K�v�����������߁A
			// �`�F�b�N���e�ƃ��b�Z�[�W�Ƃ���v���Ă��Ȃ�
			var valudUserid = validators.userid($nodes);
			if (!valudUserid) {
				clearIfContextError();
				clearContext();
				emptyedText(this);
				showError(this, label + '��6�`8�����̔��p�p�����œ��͂��Ă��������B');
				$topNode.data('invalidDigit', false);
				return true;
			}

			// �����`�F�b�N
			var validLength = validators.useridLength($nodes);
			if (!validLength) {
				clearIfContextError();
				clearContext();
				if (!$topNode.data('invalidDigit')) {
					clearError(this);
				}
				if (e.type === 'exit') {
					$topNode.data('invalidDigit', true);
					showError(this, label + '��6�`8�����̔��p�p�����œ��͂��Ă��������B');
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
					// ��� "�V�������[�U�[ID" �݂̂ɃG���[��\������
					$context.data('duplicateInvalid', $context);
				}

				// �������b�Z�[�W�͍폜����
				clearError(this);
				showError($context.data('duplicateInvalid'), '���݂Ƃ͈قȂ���̂���͂��Ă��������B');
				emptyedText(this);
				return true;
			}

			// "�V�������[�U�[ID" �� "�V�����p�X���[�h" �̕s��v�m�F
			var $newPassword = $('[data-validate-password=new]');
			var $new = $(this).parents('table').find('[data-validate-userid=new]');
			if ($new.val() && $newPassword.val()) {
				if (($new.val() === $newPassword.val())) {
					showError($newPassword, '���[�U�[ID�ƃ��O�C���p�X���[�h�͈قȂ���̂��w�肵�Ă��������B');
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

		// �p�X���[�h�`�F�b�N (22 �p�X���[�h)
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

			// �K�{���̓`�F�b�N
			var validRequired = validators.required($nodes);
			if (!validRequired) {
				valid = false;
				clearCombinationErrors();
				if (e.type === 'exit') {
					showError($topNode, label + '����͂��Ă��������B');
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
			var message = label + '�̓��[�U�[ID��6�`8�����̔��p�p�����œ��͂��Ă��������B6�`8�����́u���p�p�����̑g�ݍ��킹�v�œ��͂��Ă��������B';

			var validEisu = validators.eisu($nodes);
			if (!validEisu) {
				clearCombinationErrors();
				showError(this, message);
				emptyedText(this);
				$topNode.data('invalidDigit', false);
				return true;
			}

			// �����`�F�b�N
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

			// �g�ݍ��킹�`�F�b�N

			var $current = $(this).parents('table').find('[data-validate-password=current]');
			var $new = $(this).parents('table').find('[data-validate-password=new]');
			var $confirmation = $(this).parents('table').find('[data-validate-password=confirmation]');

			// "���݂̃��O�C���p�X���[�h" �� "�V�������O�C���p�X���[�h" �̕s��v�m�F
			var passwordType = $topNode.data('validatePassword');
			var _invalid = false;
			if ($new.val()) {
				if ($current.val() === $new.val()) {
					showError($new, '���݂Ƃ͈قȂ���̂��w�肵�Ă��������B');
					emptyedText($new);
					$new.data('combinationInvalid', true);
					_invalid = true;
				} else {
					if ($new.data('combinationInvalid')) {
						clearError($new); // TODO �����͏��������Ǝv����
					}
					$new.data('combinationInvalid', false);
					filledText($new);
				}
			}
			// "�V�������O�C���p�X���[�h" �� "�V�������O�C���p�X���[�h(�m�F�p)" �̈�v�m�F
			if ($new.val() && $confirmation.val()) {
				if (($new.val() !== $confirmation.val())) {
					showError($confirmation, getLabel($new) + '��' + getLabel($confirmation) + '�͓������e����͂��Ă��������B');
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
			// "�V�������[�U�[ID" �� "�V�����p�X���[�h" �̕s��v�m�F
			var $newUseId = $('[data-validate-userid=new]');
			if ($new.val() && $newUseId.val()) {
				if (($new.val() === $newUseId.val())) {
					showError($new, '���[�U�[ID�ƃ��O�C���p�X���[�h�͈قȂ���̂��w�肵�Ă��������B');
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

		// �p�[�\�i�����b�Z�[�W�`�F�b�N (23 �p�[�\�i�����b�Z�[�W)
		bindEvent('[data-validate-personal-message]', type, function(e, context) {
			var $nodes = $(this);
			var label = getLabel(this);

			// �����͂� OK
			if (!$(this).val()) {
				clearError(this);
				return true;
			}

			var validZenkau = validators.zenkaku($nodes);
			if (!validZenkau) {
				showError(this, label + '�͑S�p25�����ȓ��œ��͂��Ă��������B');
				return true;
			}

			var validNotZenkakuKigo = validators.notzenkakukigo($nodes);
			if (!validNotZenkakuKigo) {
				showError(this, label + '�͋L���ȊO�œ��͂��Ă��������B');
				return true;
			}
			clearError(this);
		});

		// ���[���A�h���X�`�F�b�N (24 ���[���A�h���X)
		bindEvent('[data-validate-user-email]', type, function(e, context) {
			var $node = $(this);
			var label = getLabel(this);
			var $current = $node.parents('table').find('tr:eq(1)');
			var currentEmail = $current.find('td:eq(0) p').first().text();
			var currentLable = $current.find('th').text();

			var valid = true;
			var errorShown = false;

			// �K�{���̓`�F�b�N
			var validRequired = validators.required($node);
			if (!validRequired) {
				if (e.type === 'exit') {
					showError(this, label + '����͂��Ă��������B');
					emptyedText(this);
				}
				if (isCleared(e) || $node.val()) {
					clearError($node);
				}
				$node.data('invalidDigit', false);
				return  true;
			}

			label = '���[���A�h���X'; // DOM ����͎擾�ł��Ȃ����߁A�Œ�l�ŗ^����

			var validEmailban = validators.emailban($node);
			if (!validEmailban) {
				showError(this, label + '�͐��������͂��Ă��������B');
				emptyedText(this);
				return true;
			}

			var validHankaku = validators.hankaku($node);
			if (!validHankaku) {
				showError(this, label + '�͐��������͂��Ă��������B');
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
					showError(this, label + '�͐��������͂��Ă��������B');
					return true;
				}
				emptyedText(this);
			}

			// �ȉ��A�g�ݍ��킹�`�F�b�N

			var type = $(this).data('validateUserEmail');
			var value = $(this).val();
			var combinationInvalid;
			var message;
			label = getLabel(this);

			if (type === 'new') {
				if (currentEmail === value) {
					showError(this, '���݂Ƃ͈قȂ���̂���͂��Ă��������B');
					emptyedText(this);
					return true;
				}
			}

			// "�V�������[���A�h���X" �� "�V�������[���A�h���X(�m�F�p)" �̌��؂͏�ɍs��
			var $confirmation = $(this).parents('table').find('[data-validate-user-email=confirmation]');
			var $new = $(this).parents('table').find('[data-validate-user-email=new]');
			if (!errorShown && $new.val() && $confirmation.val()) {
				if ($new.val() !== $confirmation.val()) {
					valid = false;
					showError($confirmation, getLabel($new) + '��' + getLabel($confirmation) + '�͓������e����͂��Ă��������B');
					emptyedText($confirmation);
					return true;
				}
			}

			if (isEntered(e) || valid) {
				clearError(this);
			}
			toggleRequiredMark(valid, this);
		});

		// ���{�����̃`�F�b�N (12 ���z�ԍ�(1), 13 ���z�ԍ�(2), 14 ���z�ԍ�(3))
		bindEvent('[data-validate-ribo]', type, function(e, context) {
			var $nodes = $('[data-validate-ribo]');
			var $node = $(this);
			var label = $(this).parents('.section').find('th:eq(1)').first().text(); // IE ���Ƃ��� `first` ���Ȃ��ƃe�L�X�g��2���擾�����
			var type = $node.data('validateRibo');
			// �G���[��Ԃ�ێ����Ă������߂̃R���e�L�X�g
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

			// �����l���L�^����
			var initialValue = $node.data('initialValue');
			if (typeof initialValue === 'undefuned') {
				$node.data('initialValue', $node.val());
			}

			var validRequired = validators.required($node);
			if (!validRequired) {
				clearIfContextError();
				clearContext();
				if (e.type === 'exit') {
					showError($node, validators.messageArea(label + '����͂��Ă�������'));
				}
				if (isCleared(e) || $node.val()) {
					clearError($node);
				}
				return true;
			}
			var valid = true;

			// �p���f�[�V�����p�^�[���̌���
			if (initialValue) {
				// �����l������
				pattern = 3;
			} else if ($nodes.length === 1) {
				// �V���b�s���O / �L���b�V���O�̂ǂ��炩���\������Ă���
				pattern = 1;
			} else {
				// �V���b�s���O / �L���b�V���O�̗������\������Ă���
				pattern = 2;
			}

			var messages = {
					1: label + '��1�ȏ�̔��p�����œ��͂��Ă��������B'
				, 2: '�ǂ��炩�����1�ȏ�̔��p�����œ��͂��Ă��������B'
				, 3: $(this).parents('.section').find('h2').text().replace('���z�ԍ�', '���z��]���z') + '��0�ȏ�̔��p�����œ��͂��Ă��������B'
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
			// ������ '���~' �����Ă���̂ŁA�������� `Number` �ɂ���
			var availableAmount = parseInt(availableAmountText, 10);
			if (value > availableAmount) {
				label = $(this).parents('.section').find('h2').text();
				// XXX
				label = label.replace('���z�ԍ�', '���z��]���z');
				clearIfContextError();
				clearContext();
				showError($node, validators.messageArea(label + '�͑��z�\���z�͈͓̔��œ��͂��Ă��������B'));
				valid = false;
			}

			if (pattern === 2) {
				// �g�ݍ��킹�`�F�b�N
				var allZero = _($nodes).all(function(node) {
					var value = $(node).val();
					return value && validNum && (Number(value) === 0);
				});
				if (valid && allZero) {
					if (!$context.data('zeroInvalid')) {
						showError($(this), validators.messageArea('�ǂ��炩�����1�ȏ�̔��p�����œ��͂��Ă��������B'));
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

		// ���鍀�ڂ̓��͂ɂ���āA�K�{/�C�ӂ��ύX�ɂȂ鍀�ڂ̂��߂̐ݒ�
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

		// �N���̂����w(�v) �p�̃`�F�b�N
		bindEvent('[data-validate-housewife]', type, function(e, context) {
			var $job = $('[data-validate-housewife=job]');
			var $income = $('[data-validate-housewife=annual-income]');
			var $required = $('[data-validate-housewife=required]');

			var label = getLabel($income);

			var requiredMessage = '�N���̂����w(�v)�̕��́u�Ζ���v�u�Ζ���(�t���K�i)�v�u�Ζ���d�b�ԍ��v�����ׂē��͂��Ă��������B';

			// �ō��N���̕K�{���̓`�F�b�N
			var valid = validators.required($income);
			if (!valid) {
				if (_($income).contains(this)) {
					if (e.type === 'exit') {
						showError($income, label + '����͂��Ă��������B');
						emptyedText($income);
					}
					if (isEntered(e) && e.type === 'keyup') {
						clearError($income);
					}
				}
				return true;
			}

			// �ō��N���̔��p�`�F�b�N
			var validNum = validators.hankakunum($income);
			if (!validNum) {
				showError($income, label + '�͔��p�����œ��͂��Ă��������B');
				return true;
			}

			// �ō��N���͈̔̓`�F�b�N
			var value = $income.val();
			if ($job.attr('checked')) {
				if (Number(value) > 103) {
					showError($income, '104���~�ȏ�̔N����������́u�L�E�ҁv��I�����Ă��������B');
					return true;
				}
			}

			// �u�E�� = ��w�v & �u�ō��N�� = 0 ~ 103�v�̎��ɕK�{�ƂȂ鍀�ڂ̃`�F�b�N
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
					// �擪 0 (�����)�����
					$income.val(Number(value));
				}
			}

			clearError($income);
		});
	});

	// �p�[�\�i�����b�Z�[�W�̕������J�E���g�A�b�v�f�[�g
	(function() {
		var template = _.template('�c�� <%= remainingCount %>����');
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
