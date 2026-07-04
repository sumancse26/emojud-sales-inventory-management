import Swal from 'sweetalert2';

/**
 * Shows a confirmation modal using SweetAlert2.
 *
 * @param {Object} options - Configuration options for the modal.
 * @param {string} [options.title='Are you sure?'] - The title of the modal.
 * @param {string} [options.text="You won't be able to revert this!"] - The text/body of the modal.
 * @param {string} [options.icon='warning'] - The icon type (warning, error, success, info, question).
 * @param {string} [options.confirmButtonText='Yes, delete it!'] - Text for the confirm button.
 * @param {string} [options.cancelButtonText='Cancel'] - Text for the cancel button.
 * @param {string} [options.confirmButtonColor='#3085d6'] - Hex color for confirm button.
 * @param {string} [options.cancelButtonColor='#d33'] - Hex color for cancel button.
 * @returns {Promise<boolean>} - Resolves to true if confirmed, false otherwise.
 */
export const showConfirmModal = async ({
    title = 'Are you sure?',
    text = "You won't be able to revert this!",
    icon = 'warning',
    confirmButtonText = 'Yes, proceed!',
    cancelButtonText = 'Cancel',
    confirmButtonColor = '#3085d6',
    cancelButtonColor = '#d33'
} = {}) => {
    const result = await Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonColor,
        cancelButtonColor,
        confirmButtonText,
        cancelButtonText
    });

    return result.isConfirmed;
};

/**
 * Shows a success alert.
 * @param {string} title - Title of the success message.
 * @param {string} text - Details of the success message.
 */
export const showSuccessAlert = (title = 'Success!', text = '') => {
    Swal.fire({
        title,
        text,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
    });
};

/**
 * Shows an error alert.
 * @param {string} title - Title of the error message.
 * @param {string} text - Details of the error message.
 */
export const showErrorAlert = (title = 'Error!', text = 'Something went wrong.') => {
    Swal.fire({
        title,
        text,
        icon: 'error'
    });
};
