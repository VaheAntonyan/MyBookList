/*jshint esversion: 6 */
class Author {
    constructor(id, firstName, lastName, birthDate) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
    }

    static fromJson(json) {
        return new this(json.id, json.firstName, json.lastName, new Date(json.birthDate));
    }

    getFullName() {
        return this.firstName.slice(0, 1) + "." + this.lastName;
    }

    getFormattedBirthDate() {
        const dateTimeFormat = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
        const [{ value: day },,{ value: month },,{ value: year }] = dateTimeFormat.formatToParts(this.birthDate);
        
        return `${day} ${month} ${year}`;
    }

    toJSONString() {
        return JSON.stringify(this);
    }

    clone() {
        return new Author(this.id, this.firstName, this.lastName, this.birthDate);
    }

    print() {
        console.log("author id - " + this.id);
        console.log("author firstName - " + this.firstName);
        console.log("author lastName - ", this.lastName);
        console.log("author birthdate - ", this.getFormattedBirthDate());
    }
}