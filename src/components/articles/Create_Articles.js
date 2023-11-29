import 'bootstrap/dist/css/bootstrap.css';

const Create_Article = () => {
    return (
        <div class="editor-page">
            <div class="container page">
                <div class="row">
                    <div class="col-md-10 offset-md-1 col-xs-12">
                        <ul class="error-messages">
                        </ul>

                        <form>
                            <fieldset>
                                <fieldset class="form-group">
                                    <input type="text" class="form-control form-control-lg" placeholder="Article Title" />
                                </fieldset>
                                <fieldset class="form-group">
                                    <input type="text" class="form-control" placeholder="What's this article about?" />
                                </fieldset>
                                <fieldset class="form-group">
                                    <textarea
                                        class="form-control"
                                        rows="8"
                                        placeholder="Write your article (in markdown)"
                                    ></textarea>
                                </fieldset>
                                <fieldset class="form-group">
                                    <input type="text" class="form-control" placeholder="Enter tags" />
                                    <div class="tag-list">
                                    </div>
                                </fieldset>
                                <button style={{alignItems: "left"}} class="btn btn-lg pull-xs-right btn-success" type="button">
                                    Publish Article
                                </button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Create_Article