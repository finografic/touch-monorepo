// Correct import - import individual components, not as Form.X
import { Form, FormControl, FormField, FormLabel, FormMessage, FormSubmit } from '@radix-ui/react-form';
import './RadixForm-DEMO.css';

const FormDemo = () => (
  <Form className="FormRoot">
    <FormField className="FormField" name="email">
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
        }}
      >
        <FormLabel className="FormLabel">Email</FormLabel>
        <FormMessage className="FormMessage" match="valueMissing">
          Please enter your email
        </FormMessage>
        <FormMessage className="FormMessage" match="typeMismatch">
          Please provide a valid email
        </FormMessage>
      </div>
      <FormControl asChild>
        <input className="Input" type="email" required />
      </FormControl>
    </FormField>
    <FormField className="FormField" name="question">
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
        }}
      >
        <FormLabel className="FormLabel">Question</FormLabel>
        <FormMessage className="FormMessage" match="valueMissing">
          Please enter a question
        </FormMessage>
      </div>
      <FormControl asChild>
        <textarea className="Textarea" required />
      </FormControl>
    </FormField>
    <FormSubmit asChild>
      <button className="Button" style={{ marginTop: 10 }}>
        Post question
      </button>
    </FormSubmit>
  </Form>
);

export default FormDemo;
