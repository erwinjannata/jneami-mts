import { Container, Form, Row } from "react-bootstrap";
import NavMenu from "../../../../components/partials/navbarMenu";
import { useState } from "react";

const PersonalPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  console.log(uploadedFiles);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>Personal</h2>
        <hr />
        <Row>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>
              <strong>Excel SMU</strong>
            </Form.Label>
            <Form.Control
              type="file"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              multiple
              onChange={(event) => {
                const input = Array.from(event.target.files);
                setUploadedFiles(input);
              }}
            />
          </Form.Group>
        </Row>
        <hr />
        {uploadedFiles.map((file, index) => (
          <p key={index}>{file.name}</p>
        ))}
      </Container>
    </div>
  );
};

export default PersonalPage;
