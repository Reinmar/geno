class ResultsController < ApplicationController
  def save
    r = Result.new
    r.content = params[:content]
    r.save

    respond_to do |format|
      format.html { render :action => 'save' }
      format.xml  { head :ok }
    end
  end
end
