function Form() {
    return (
      <form>
        <label>
          Nimi: 
          <input type="text" name="nimi" />
        </label>
        <button type="submit">Lähetä</button>
      </form>
    );
  }
  
  export default Form;