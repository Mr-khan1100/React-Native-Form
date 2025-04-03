import { Alert } from 'react-native';
import { CURRENTLY_WORKING, DATE_REGEX } from '../constants/personalScreenConstants';

export const countryValidations = {
    'US': {
    regex: /^[2-9]\d{9}$/,
    error: 'US number: 10 digits starting with 2-9',
    },
    'IN': {
    regex: /^[6-9]\d{9}$/,
    error: 'Indian number: 10 digits starting with 6-9',
    },
    'GB': {
    regex: /^(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:(?:0\)?[\s-]?)?)|)(?:\d{5}[\s-]?\d{4,5}|\d{10})$)/,
    error: 'UK number: 10 digits in valid format',
    },
    'AU': {
    regex: /^[1-9]\d{8}$/,
    error: 'Australian number: 9 digits starting with 1-9',
    },
    'CA': {
    regex: /^[2-9]\d{9}$/,
    error: 'Canadian number: 10 digits starting with 2-9',
    },
    'DE': {
    regex: /^[1-9]\d{10}$/,
    error: 'German number: 11 digits starting with 1-9',
    },
    'FR': {
    regex: /^[1-9]\d{8}$/,
    error: 'French number: 9 digits starting with 1-9',
    },
};

export  const isValidDate = date => {
    const datePattern = DATE_REGEX;

    if(date === CURRENTLY_WORKING) {
        return false;
    }

    if (!datePattern.test(date)) {
        return false;
    }

    const [day, month, year] = date.split('/').map(Number);
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
        return false;
    }
    const daysInMonth = {
        1: 31,
        2: year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31,
    };

    return day >= 1 && day <= daysInMonth[month];
};
    
export const isDateInFuture = dateString => {
    if(dateString === CURRENTLY_WORKING) {
        return false;
    }
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    return date > today;
};

export const handleDateChange = (text) => {
    let sanitizedText = text.replace(/[^0-9]/g, '');
    let formattedText = '';
    const currentYear = new Date().getFullYear();

    let day = sanitizedText.slice(0, 2);
    let month = sanitizedText.slice(2, 4);
    let year = sanitizedText.slice(4, 8);

    if (day.length === 2) {
      let dayNum = parseInt(day, 10);
      if (dayNum < 1) {
        day = '01';
      } else if (dayNum > 31) {
        day = '31';
      }
    }

    if (month.length === 2) {
      let monthNum = parseInt(month, 10);
      if (monthNum < 1 || monthNum > 12) {
        month = '01';
      }
    }

    const maxDays = {
      '01': 31,
      '02': 29,
      '03': 31,
      '04': 30,
      '05': 31,
      '06': 30,
      '07': 31,
      '08': 31,
      '09': 30,
      10: 31,
      11: 30,
      12: 31,
    };

    if (day.length === 2 && month.length === 2) {
      let dayNum = parseInt(day, 10);
      let maxDay = maxDays[month] || 31;

      if (dayNum > maxDay) {
        day = maxDay.toString().padStart(2, '0');
      }
    }

    if (year.length === 4) {
      let yearNum = parseInt(year, 10);
      if (yearNum < 1900 || yearNum > currentYear) {
        year = currentYear.toString();
      }
    }

    if (sanitizedText.length >= 1) formattedText += day;
    if (sanitizedText.length >= 3) formattedText += '/' + month;
    if (sanitizedText.length >= 5) formattedText += '/' + year;

    return formattedText;
};

export const formatDate = date => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export const Alerts = (header, message) =>{
    Alert.alert(
        header,  
        message,
        [
            { 
            text: 'OK', 
            onPress: () => console.log('OK Pressed'),
            style: 'cancel' ,
            },
        ],
        { cancelable: true }
    );
};

