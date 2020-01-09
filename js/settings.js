const saveButton = document.getElementById('save');
const status = document.getElementById('status');
const identifyOwnCommentsCheckbox = document.getElementById('identify_own_comments');
const identifySubmitterCommentsCheckbox = document.getElementById('identify_submitter_comments');
const showParentCommentLinkCheckbox = document.getElementById('show_parent_comment_link');
const showTimeFilterCheckbox = document.getElementById('show_time_filter');

chrome.storage.local.get({
    identifyOwnComments: true,
    identifySubmitterComments: true,
    showParentCommentLink: true,
    showTimeFilter: true
}, function(settings) {
    identifyOwnCommentsCheckbox.checked = settings.identifyOwnComments;
    identifySubmitterCommentsCheckbox.checked = settings.identifySubmitterComments;
    showParentCommentLinkCheckbox.checked = settings.showParentCommentLink;
    showTimeFilterCheckbox.checked = settings.showTimeFilter;
});

saveButton.addEventListener('click', function() {
    chrome.storage.local.set({
        identifyOwnComments: identifyOwnCommentsCheckbox.checked,
        identifySubmitterComments: identifySubmitterCommentsCheckbox.checked,
        showParentCommentLink: showParentCommentLinkCheckbox.checked,
        showTimeFilter: showTimeFilterCheckbox.checked
    }, function() {
        const status = document.getElementById('status');
        saveButton.style.display = 'none';
        status.style.display = 'block';
        setTimeout(function() {
            saveButton.style.display = 'block';
            status.style.display = 'none';
        }, 2000);
    });
});