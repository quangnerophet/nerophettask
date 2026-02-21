export const getStatusClass = (status) => {
    switch (status) {
        case 'Chờ xử lý':
            return 'status-pending';
        case 'Đang thực hiện':
            return 'status-inprogress';
        case 'Hoàn thành':
            return 'status-completed';
        default:
            return 'status-pending'; // default
    }
};

export const getPriorityClass = (priority) => {
    switch (priority) {
        case 'Cao':
            return 'priority-high';
        case 'Trung bình':
            return 'priority-medium';
        case 'Thấp':
            return 'priority-low';
        default:
            return 'priority-medium';
    }
};
