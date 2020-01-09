const commentTree = document.querySelector('table.comment-tree');
const comments = commentTree.querySelectorAll('tr.comtr');

// object containing visited parent comments: key is index of comment, value is index of comment's parent;
// prevents repeated calculations of parent indices
const parentCommentIndices = {};

function getParentCommentIndex(commentIndex) {
	if (parentCommentIndices.hasOwnProperty(commentIndex)) {
		return parentCommentIndices[commentIndex];
	} else {
		const commentIndent = comments[commentIndex].querySelector('td.ind img').clientWidth;
		let parentCommentIndex = -1;
		if (commentIndent > 0) {
			// comment indent is greater than zero, so parent is not the submission
			// the parent of a comment has an indent that is 40px less than that of the comment
			const parentCommentIndent = commentIndent - 40;
			for (let i = commentIndex - 1; i >= 0; --i) {
				const currentCommentIndent = comments[i].querySelector('td.ind img').clientWidth;
				if (currentCommentIndent === parentCommentIndent) {
					parentCommentIndex = i;
					break;
				}
			}
		}
		parentCommentIndices[commentIndex] = parentCommentIndex;
		return parentCommentIndex;
	}
}

function initialize(settings) {
	if (settings.showTimeFilter) {
		const timeFilterContainer = document.createElement('div');
		timeFilterContainer.style.marginLeft = '1em';

		const quantitySelect = document.createElement('select');
		quantitySelect.style.marginRight = '0.2em';

		const unitSelect = document.createElement('select');
		unitSelect.style.marginRight = '0.2em';
		unitSelect.options.add(new Option());
		unitSelect.options.add(new Option('Minute(s)', 'minute'));
		unitSelect.options.add(new Option('Hour(s)', 'hour'));
		unitSelect.options.add(new Option('Day(s)', 'day'));
		unitSelect.options.add(new Option('Month(s)', 'month'));

		const timeFilter = document.createElement('a');
		timeFilter.textContent = 'ago';

		timeFilterContainer.appendChild(quantitySelect);
		timeFilterContainer.appendChild(unitSelect);
		timeFilterContainer.appendChild(timeFilter);
		commentTree.parentNode.insertBefore(timeFilterContainer, commentTree);

		unitSelect.addEventListener('change', function() {
			let begin;
			let end;

			quantitySelect.options.length = 0;

			switch (unitSelect.value) {
				case 'minute':
					begin = 0;
					end = 59;
					break;
				case 'hour':
					begin = 1;
					end = 23;
					break;
				case 'day':
					begin = 1;
					end = 89;
					break;
				case 'month':
					begin = 1;
					end = 12;
					break;
			}

			for (let i = begin; i <= end; ++i) {
				quantitySelect.options.add(new Option(i, i));
			}
		});

		timeFilter.addEventListener('click', function() {
			const quantity = quantitySelect.value;
			let unit = unitSelect.value;

			if (quantity !== '1') {
				unit += 's';
			}

			const filterString = `${quantity} ${unit} ago`;
			
			for (const comment of comments) {
				comment.style.backgroundColor = null;
				const age = comment.querySelector('span.age a').textContent;
				if (age === filterString) {
					comment.style.backgroundColor = '#FF6600';
				}
			}
		});
	}

	const currentUserEl = document.querySelector('a#me');
	const currentUser = currentUserEl ? currentUserEl.textContent : null;
	const submitter = document.querySelector('a.hnuser').textContent;

	for (let i = 0; i < comments.length; ++i) {
		const comment = comments[i];
		const author = comment.querySelector('a.hnuser');

		if (settings.identifyOwnComments && author.textContent === currentUser) {
			author.classList.add('identifier', 'current-user');
			author.textContent += ' [YOU]';
		} else if (settings.identifySubmitterComments && author.textContent === submitter) {
			author.classList.add('identifier', 'submitter');
			author.textContent += ' [S]';
		}

		if (settings.showParentCommentLink) {
			const parentLink = document.createElement('a');
			parentLink.textContent = 'parent';
			parentLink.className = 'parent-link';
			comment.querySelector('div.reply p font').appendChild(parentLink);
			parentLink.addEventListener('click', function() {
				const parentIndex = getParentCommentIndex(i);
				const parentElement = parentIndex >= 0 ? comments[parentIndex] : document.querySelector('table.fatitem');
				window.scrollTo({ top: parentElement.offsetTop });
				parentElement.style.backgroundColor = '#FF6600';
				setTimeout(() => parentElement.style.backgroundColor = null, 2000);
				return false;
			});
		}
	}
}

chrome.storage.local.get({
    identifyOwnComments: true,
    identifySubmitterComments: true,
    showParentCommentLink: true,
    showTimeFilter: true
}, function (settings) {
	initialize(settings);
});