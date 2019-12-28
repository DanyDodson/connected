
export const signUpEmailTemplate = async (email, client, token) => {

  const data = `
    <body itemscope itemtype="http://schema.org/EmailMessage">
      <div itemprop="action" itemscope itemtype="http://schema.org/ConfirmAction">
        <meta itemprop="name" content="Confirm Email" />
        <div>Welcome ${email}. Please confirm your email address by clicking the link below.</div>
        <div>We may need to send you critical information about our service and it is important that we have an accurate email address.</div>
        <div itemprop="handler" itemscope itemtype="http://schema.org/HttpActionHandler">
          <a href="${client}${token}" itemprop="url">Confirm email address</a>
        </div>
        </div>
        <div>Follow<a href="http://twitter.com/seesee">@SeeSee</a> on Twitter.</div>
    </body>
  `

  return data
}
